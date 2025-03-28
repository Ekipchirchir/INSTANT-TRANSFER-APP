import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import Screens
import LoginScreen from "./Screens/LoginScreen";
import HomeScreen from "./Screens/HomeScreen";
import TransactionScreen from "./Screens/TransactionScreen";
import DepositScreen from "./Screens/DepositScreen";
import WithdrawalScreen from "./Screens/WithdrawalScreen";
import SettingsScreen from "./Screens/SettingsScreen";
import DerivConnectScreen from "./Screens/DerivConnectScreen";

const linking = {
  prefixes: ["instanttransfer://"],
  config: {
    screens: {
      Home: "auth-success",
      Login: "auth-failed",
      DerivConnectScreen: "deriv-connect",
      Transactions: "transactions",
      Deposit: "deposit",
      Withdrawal: "withdrawal",
      Settings: "settings",
    },
  },
};

const Stack = createStackNavigator();

const Navigation = ({ navigation }) => {
  useEffect(() => {
    const handleDeepLink = async ({ url }) => {
      console.log("🔗 Deep Link Received:", url);
      const { queryParams } = Linking.parse(url);
      console.log("🔍 Parsed Query Params:", queryParams);

      if (queryParams?.access_token && queryParams?.deriv_account) {
        try {
          await AsyncStorage.multiSet([
            ["access_token", queryParams.access_token],
            ["deriv_account", queryParams.deriv_account],
            ["is_logged_in", "true"],
          ]);
          console.log("✅ Deep Link Data Stored!");

          setTimeout(() => {
            navigation.replace("Home");
          }, 500);
        } catch (error) {
          console.error("🚨 Error storing deep link data:", error);
        }
      }
    };

    Linking.addEventListener("url", handleDeepLink);
  }, []);

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DerivConnect" component={DerivConnectScreen}/>
        <Stack.Screen name="Transactions" component={TransactionScreen} />
        <Stack.Screen name="Deposit" component={DepositScreen} />
        <Stack.Screen name="Withdrawal" component={WithdrawalScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
