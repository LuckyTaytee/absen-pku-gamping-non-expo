import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const PLATFORM_LOCATION_PERMISSIONS = {
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
}

const REQUEST_PERMISSION_TYPE = {
    location: PLATFORM_LOCATION_PERMISSIONS
}

const PERMISSION_TYPE = {
    location: 'location'
}

class AppPermission {

    checkPermission = async (type, os): Promise<boolean> => {
        console.log("check type :", type)
        const permissions = REQUEST_PERMISSION_TYPE[type][os]
        console.log("check permissions :", permissions)
        if (!permissions) {
            return true
        }
        try {
            const result = await check(permissions)
            console.log("check result :", result)
            if (result === RESULTS.GRANTED) return true
            return this.requestPermission(permissions)
        } catch (error) {
            console.log("check error :", error)
            return false
        }
    }

    requestPermission = async (permissions): Promise<boolean> => {
        console.log("request permissions :", permissions)
        try {
            const result = await request(permissions)
            console.log("request result :", result)
            return result == RESULTS.GRANTED
        } catch (error) {
            console.log("request error :", error)
            return false
        }
    }
}

const Permission = new AppPermission()
export {Permission, PERMISSION_TYPE}
    