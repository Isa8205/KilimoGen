async function getFarmer(id: number) {
    const farmer = await window.electron.invoke("get-farmer", {id: id})

    return farmer
}

export default getFarmer