export type MenuItem<Value> = {
	value: Value,
	label: string,
	disabled?: boolean,
	icon?: string,
	onClick?: (item: MenuItem<Value>) => void
}

export type MenuItemGroup<Value> = {
	value?: Value,
	label: string,
	items: MenuItems<Value>,
	disabled?: boolean,
}

export type MenuItems<Value> = (MenuItem<Value> | MenuItemGroup<Value>)[]
