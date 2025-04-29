/**
 * A utility used to manage the userSettings object stored in the local storage. 
 * Has an optional parameter for the specific member being fetched in the object.
 * @param key 
 * @returns 
 */
const getSettings = (key?: string): any => {
    const settings = localStorage.getItem('userSettings')
    if (key) {
        const value = settings?.[key as any]
        return value
    }

    return settings
}