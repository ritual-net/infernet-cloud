import type { SubmitFunction } from '@sveltejs/kit'

export type MenuItem<Value> = {
	value: Value,
	label: string,
	disabled?: boolean,
	icon?: string,
	onClick?: (item: MenuItem<Value>) => void,
	formAction?: string,
	formMethod?: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
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
