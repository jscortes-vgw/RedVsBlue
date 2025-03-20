const host = 'http://localhost:8888'


export const addBattleground = async () => {
    const path = '/battlegrounds'
    const res = await fetch(`${host}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "start": "2025-03-20T01:00:00.000Z",
            "end": "2025-03-20T02:00:00.000",
            "limit": 5
        })
    })
    const data = await res.json()
    return data
}


export const getBattlegrounds = async () => {
    const path = '/battlegrounds'
    const res = await fetch(`${host}${path}`, {
        method: 'GET'
    })
    const data = await res.json()
    return data
}

export const addNewPlayer = async (teamColor: string, userId: number) => {
    const path = `/battlegrounds/latest/teams/${teamColor}/users`
    const res = await fetch(`${host}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: userId
        })
    })
    const data = await res.json()
    return data
}

export const playRound = async (userId: number, spend: number) => {
    const path = `/battlegrounds/latest/teams/red/users/${userId}/spend`
    const res = await fetch(`${host}${path}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            spend: spend
        })
    })
    const data = await res.json()
    return data
}
