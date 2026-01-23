import { eq, inArray } from 'drizzle-orm';
import { db } from '@/libs/DB';
import {
  classScheduleExceptionSchema,
  classScheduleInstanceSchema,
  classSchema,
  classTagSchema,
  programSchema,
  tagSchema,
} from '@/models/Schema';

// =============================================================================
// TYPES
// =============================================================================

export type ClassSchedule = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  instructorClerkId: string | null;
};

export type ClassScheduleException = {
  id: string;
  classScheduleInstanceId: string;
  exceptionDate: Date;
  exceptionType: string;
  newStartTime: string | null;
  newEndTime: string | null;
  newInstructorClerkId: string | null;
  reason: string | null;
};

export type ClassTag = {
  id: string;
  name: string;
  slug: string;
  color: string | null;
};

export type ClassData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  defaultDurationMinutes: number | null;
  minAge: number | null;
  maxAge: number | null;
  maxCapacity: number | null;
  isActive: boolean | null;
  program: {
    id: string;
    name: string;
    slug: string;
    color: string | null;
  } | null;
  tags: ClassTag[];
  schedule: ClassSchedule[];
  scheduleExceptions: ClassScheduleException[];
};

// =============================================================================
// SERVICE FUNCTIONS
// =============================================================================

/**
 * Get all classes for an organization with their schedules, tags, and exceptions
 */
export async function getOrganizationClasses(organizationId: string): Promise<ClassData[]> {
  // Fetch all classes for the organization
  const classes = await db
    .select()
    .from(classSchema)
    .where(eq(classSchema.organizationId, organizationId));

  if (classes.length === 0) {
    return [];
  }

  const classIds = classes.map(c => c.id);
  const programIds = [...new Set(classes.map(c => c.programId).filter(Boolean))] as string[];

  // Fetch related data in parallel
  const [programs, scheduleInstances, classTags, allTags] = await Promise.all([
    // Fetch programs
    programIds.length > 0
      ? db.select().from(programSchema).where(inArray(programSchema.id, programIds))
      : Promise.resolve([]),

    // Fetch schedule instances
    db.select().from(classScheduleInstanceSchema).where(inArray(classScheduleInstanceSchema.classId, classIds)),

    // Fetch class-tag relationships
    db.select().from(classTagSchema).where(inArray(classTagSchema.classId, classIds)),

    // Fetch all class tags for the organization
    db.select().from(tagSchema).where(eq(tagSchema.organizationId, organizationId)),
  ]);

  // Fetch schedule exceptions for all schedule instances
  const scheduleInstanceIds = scheduleInstances.map(s => s.id);
  const scheduleExceptions = scheduleInstanceIds.length > 0
    ? await db
        .select()
        .from(classScheduleExceptionSchema)
        .where(inArray(classScheduleExceptionSchema.classScheduleInstanceId, scheduleInstanceIds))
    : [];

  // Create lookup maps
  const programMap = new Map(programs.map(p => [p.id, p]));
  const tagMap = new Map(allTags.map(t => [t.id, t]));

  // Group schedule instances by class
  const schedulesByClass = new Map<string, ClassSchedule[]>();
  scheduleInstances.forEach((instance) => {
    const existing = schedulesByClass.get(instance.classId) || [];
    existing.push({
      id: instance.id,
      dayOfWeek: instance.dayOfWeek,
      startTime: instance.startTime,
      endTime: instance.endTime,
      instructorClerkId: instance.primaryInstructorClerkId,
    });
    schedulesByClass.set(instance.classId, existing);
  });

  // Group exceptions by class (via schedule instance)
  const scheduleInstanceToClass = new Map(scheduleInstances.map(s => [s.id, s.classId]));
  const exceptionsByClass = new Map<string, ClassScheduleException[]>();
  scheduleExceptions.forEach((exception) => {
    const classId = scheduleInstanceToClass.get(exception.classScheduleInstanceId);
    if (classId) {
      const existing = exceptionsByClass.get(classId) || [];
      existing.push({
        id: exception.id,
        classScheduleInstanceId: exception.classScheduleInstanceId,
        exceptionDate: exception.exceptionDate,
        exceptionType: exception.exceptionType,
        newStartTime: exception.newStartTime,
        newEndTime: exception.newEndTime,
        newInstructorClerkId: exception.newInstructorClerkId,
        reason: exception.reason,
      });
      exceptionsByClass.set(classId, existing);
    }
  });

  // Group tags by class
  const tagsByClass = new Map<string, ClassTag[]>();
  classTags.forEach((ct) => {
    const tag = tagMap.get(ct.tagId);
    if (tag) {
      const existing = tagsByClass.get(ct.classId) || [];
      existing.push({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        color: tag.color,
      });
      tagsByClass.set(ct.classId, existing);
    }
  });

  // Map classes with all related data
  return classes.map((cls) => {
    const program = cls.programId ? programMap.get(cls.programId) : null;
    return {
      id: cls.id,
      name: cls.name,
      slug: cls.slug,
      description: cls.description,
      color: cls.color,
      defaultDurationMinutes: cls.defaultDurationMinutes,
      minAge: cls.minAge,
      maxAge: cls.maxAge,
      maxCapacity: cls.maxCapacity,
      isActive: cls.isActive,
      program: program
        ? {
            id: program.id,
            name: program.name,
            slug: program.slug,
            color: program.color,
          }
        : null,
      tags: tagsByClass.get(cls.id) || [],
      schedule: schedulesByClass.get(cls.id) || [],
      scheduleExceptions: exceptionsByClass.get(cls.id) || [],
    };
  });
}

/**
 * Get a single class by ID
 */
export async function getClassById(classId: string, organizationId: string): Promise<ClassData | null> {
  const classes = await getOrganizationClasses(organizationId);
  return classes.find(c => c.id === classId) || null;
}

/**
 * Get all class tags for an organization
 */
export async function getClassTags(organizationId: string): Promise<ClassTag[]> {
  const tags = await db
    .select()
    .from(tagSchema)
    .where(eq(tagSchema.organizationId, organizationId));

  return tags
    .filter(t => t.entityType === 'class')
    .map(t => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      color: t.color ?? null,
    }));
}
