export const CenteredHero = (props: {
  title: React.ReactNode;
  buttons: React.ReactNode;
}) => (
  <>
    <div className="mt-3 text-center text-5xl font-bold tracking-tight">
      {props.title}
    </div>

    <div className="mt-8 flex justify-center gap-x-5 gap-y-3 max-sm:flex-col">
      {props.buttons}
    </div>
  </>
);
