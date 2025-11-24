export const CenteredHero = (props: {
  logo?: React.ReactNode;
  title: React.ReactNode;
  buttons: React.ReactNode;
}) => (
  <div className="flex flex-col items-center justify-center">
    {props.logo && (
      <div className="mb-8">
        {props.logo}
      </div>
    )}

    <div className="text-center text-5xl font-bold tracking-tight">
      {props.title}
    </div>

    <div className="mt-8 flex justify-center gap-x-5 gap-y-3 max-sm:flex-col">
      {props.buttons}
    </div>
  </div>
);
