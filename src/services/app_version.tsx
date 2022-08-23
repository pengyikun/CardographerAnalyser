import axios from "axios";

const endpoints = "https://cardographer-analyser.herokuapp.com/version"

export interface VersionInfo {
    versionId: string,
    description: string,
    requireDataReset: boolean,
    requireLogout: boolean,
}

export const fetchLatestVersionInfo = async () => {
    const res = await axios.get(endpoints)
    const {status} = res
    if (status === 200) {
        const versionInfo: VersionInfo = res.data
        console.log('[API_VERSION] ', versionInfo)
        return versionInfo

    } else {
        console.log(`${status} Failed Fetching snapshots`)
        return undefined
    }
}
