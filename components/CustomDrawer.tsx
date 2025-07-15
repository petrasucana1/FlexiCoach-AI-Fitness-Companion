import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { View, Text, Image } from "react-native";
import {Colors} from "../constants/Colors"
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomDrawer(props :any) {
    const router=useRouter();
    const {top, bottom} = useSafeAreaInsets();
    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props} scrollEnabled={false}
            contentContainerStyle={{backgroundColor:Colors.transparent_black_purple}}>
            <View style={{padding:30}}>
                <Image 
                    source={require('../assets/images/icon_no_background.png')}
                     style={{width:100, height:100, alignSelf: 'center'}} 
                />
            </View>
                <DrawerItemList {...props} />
                <DrawerItem label={"Logout"} onPress={() => router.replace ('/')} />
            </DrawerContentScrollView>

            <View
                style={{
                    borderTopColor:Colors.red,
                    borderTopWidth:1,
                    padding:20,
                    paddingBottom:20+bottom,
                }}>
                <Text>Footer</Text>
                </View>
        </View>

        
    

    );
}