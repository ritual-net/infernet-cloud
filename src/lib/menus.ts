// Types
import type { SubmitFunction } from '@sveltejs/kit'

export type MenuItem<Value> = {
	value: Value,
	label: string,
	disabled?: boolean,
	icon?: string | ConstructorOfATypedSvelteComponent,
	isDestructive?: boolean,
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


// Functions
export const findMenuItem = <Value>(
	items: MenuItems<Value>,
	value: Value,
): MenuItem<Value> | undefined => {
	let found: MenuItem<Value> | undefined

	for(const itemOrGroup of items){
		if('items' in itemOrGroup){
			if(found = findMenuItem(itemOrGroup.items, value))
				return found
		}else if('value' in itemOrGroup){
			if(itemOrGroup.value === value)
				return itemOrGroup
		}
	}

	return undefined
}
