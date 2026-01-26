
type Props = {
    value: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    id: string;
};

type PropsSingleNotSet = {
    value: boolean | undefined;
    onChange: (checked: boolean) => void;
    label: string;
    id: string;
};

type PropsNotSet = {
    value: boolean | undefined;
    onChange: (checked: boolean) => void;
    label_one: string;
    id_one: string;
    label_two: string;
    id_two: string;
    
};

export function SingleCheckbox({ value, onChange, label, id }: Props) {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        onChange(e.target.checked);
    };
    return (
        <>
            <div className="flex h-6 shrink-0 items-center justify-items-end">
                <div className="group grid size-4 grid-cols-1">
                    <input
                        id={id}
                        name={id}
                        checked={value}
                        onChange={handleChange}
                        type="checkbox"
                        aria-describedby={label}
                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-[var(--dark-teal)] bg-white checked:border-[var(--bright-pink)] checked:bg-[var(--bright-pink)] indeterminate:border-[var(--bright-pink)] indeterminate:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] disabled:border-[var(--darkest-teal)]/40 disabled:bg-[var(--darkest-teal)]/20 disabled:checked:bg-[var(--darkest-teal)]/40 cursor-pointer"
                    />
                    <svg
                        fill="none"
                        viewBox="0 0 14 14"
                        className={`pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25`}>
                        <path
                            d="M3 8L6 11L11 3.5"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-checked:opacity-100" />
                        <path
                            d="M3 7H11"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-indeterminate:opacity-100" />
                    </svg>
                </div>
            </div>
            <div className="">
                <label htmlFor={id} className="font-medium text-[var(--darkest-teal)] custom-style">
                    {label}
                </label>
            </div>
        </>
    )
};

export function SingleCheckboxNotSet({ value, onChange, label, id }: PropsSingleNotSet) {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        onChange(e.target.checked);
    };
    return (
        <>
            <div className="flex h-6 shrink-0 items-center justify-items-end">
                <div className="group grid size-4 grid-cols-1">
                    <input
                        id={id}
                        name={id}
                        defaultChecked={value}
                        checked={value}
                        onChange={handleChange}
                        type="checkbox"
                        aria-describedby={label}
                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-[var(--dark-teal)] bg-white checked:border-[var(--bright-pink)] checked:bg-[var(--bright-pink)] indeterminate:border-[var(--bright-pink)] indeterminate:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] disabled:border-[var(--darkest-teal)]/40 disabled:bg-[var(--darkest-teal)]/20 disabled:checked:bg-[var(--darkest-teal)]/40 cursor-pointer"
                    />
                    <svg
                        fill="none"
                        viewBox="0 0 14 14"
                        className={`pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25`}>
                        <path
                            d="M3 8L6 11L11 3.5"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-checked:opacity-100" />
                        <path
                            d="M3 7H11"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-indeterminate:opacity-100" />
                    </svg>
                </div>
            </div>
            <div className="">
                <label htmlFor={id} className="font-medium text-[var(--darkest-teal)] custom-style">
                    {label}
                </label>
            </div>
        </>
    )
};


export function DoubleCheckbox({ value, onChange, label_one, id_one, label_two, id_two }: PropsNotSet) {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        onChange(e.target.checked);
    };
    return (
        <>
            <div className="flex h-6 shrink-0 items-center justify-items-end">
                <div className="group grid size-4 grid-cols-1">
                    <input
                        id={id_one}
                        name={id_one}
                        checked={value}
                        onChange={handleChange}
                        type="checkbox"
                        aria-describedby={label_one}
                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-[var(--dark-teal)] bg-white checked:border-[var(--bright-pink)] checked:bg-[var(--bright-pink)] indeterminate:border-[var(--bright-pink)] indeterminate:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] disabled:border-[var(--darkest-teal)]/40 disabled:bg-[var(--darkest-teal)]/20 disabled:checked:bg-[var(--darkest-teal)]/40 cursor-pointer"
                    />
                    <svg
                        fill="none"
                        viewBox="0 0 14 14"
                        className={`pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25`}>
                        <path
                            d="M3 8L6 11L11 3.5"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-checked:opacity-100" />
                        <path
                            d="M3 7H11"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-indeterminate:opacity-100" />
                    </svg>
                </div>
            </div>
            <div className="">
                <label htmlFor={id_one} className="font-medium text-[var(--darkest-teal)] custom-style">
                    {label_one}
                </label>
            </div>
            <div className="flex h-6 shrink-0 items-center justify-items-end">
                <div className="group grid size-4 grid-cols-1">
                    <input
                        id={id_two}
                        name={id_two}
                        checked={!value}
                        onChange={handleChange}
                        type="checkbox"
                        aria-describedby={label_two}
                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-[var(--dark-teal)] bg-white checked:border-[var(--bright-pink)] checked:bg-[var(--bright-pink)] indeterminate:border-[var(--bright-pink)] indeterminate:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] disabled:border-[var(--darkest-teal)]/40 disabled:bg-[var(--darkest-teal)]/20 disabled:checked:bg-[var(--darkest-teal)]/40 cursor-pointer"
                    />
                    <svg
                        fill="none"
                        viewBox="0 0 14 14"
                        className={`pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25`}>
                        <path
                            d="M3 8L6 11L11 3.5"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-checked:opacity-100" />
                        <path
                            d="M3 7H11"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-indeterminate:opacity-100" />
                    </svg>
                </div>
            </div>
            <div className="">
                <label htmlFor={id_two} className="font-medium text-[var(--darkest-teal)] custom-style">
                    {label_two}
                </label>
            </div>
        </>
    )
};