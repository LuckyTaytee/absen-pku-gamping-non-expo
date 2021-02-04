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
        const permissions = REQUEST_PERMISSION_TYPE[type][os]
        if (!permissions) {
            return true
        }
        try {
            const result = await check(permissions)
            if (result === RESULTS.GRANTED) return true
            return this.requestPermission(permissions)
        } catch (error) {
            return false
        }
    }

    requestPermission = async (permissions): Promise<boolean> => {
        try {
            const result = await request(permissions)
            return result == RESULTS.GRANTED
        } catch (error) {
            return false
        }
    }
}

const Permission = new AppPermission()
export {Permission, PERMISSION_TYPE}
    