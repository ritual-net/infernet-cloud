export type MenuItem<Value> = {
	value: Value,
	label: string,
	disabled?: boolean,
	icon?: string,
	onClick?: (item: MenuItem<Value>) => void,
	formAction?: string,
	formSubmit?: SubmitFunction,
}

export type MenuItemGroup<Value> = {
	value: Value,
	label: string,
	disabled?: boolean,
	icon?: string,
	items: MenuItems<Value>,
}

export type MenuItems<Value> = (MenuItem<Value> | MenuItemGroup<Value>)[]
