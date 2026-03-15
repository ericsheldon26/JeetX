import * as React from "react";
import { ScrollView, StyleSheet, Text, View, Image as RNImage } from "react-native";

const Image = (props: any) => <View {...props} style={[{ backgroundColor: 'rgba(255,255,255,0.1)' }, props.style]} ><RNImage {...props} style={{ display: 'none' }} /></View>;
import LinearGradient from "react-native-linear-gradient";
// import { SafeAreaView } from "react-native-safe-area-context"; // Original Windows/Native code
import ScreenWrapper from "../../components/ScreenWrapper"; // Linux/NewArch Fix


const AddMoney = () => {

    return (
        <ScreenWrapper 
          style={styles.addMoney}
          statusBarColor="#010e0f"
          statusBarStyle="light-content"
          backgroundColor="#f4f6f6"
        >
            {/* <SafeAreaView style={styles.viewBg}> */} {/* Original code */}

            <View style={[styles.view, styles.viewLayout]}>
                <LinearGradient style={[styles.bg, styles.bgLayout]} locations={[0, 1]} colors={['#02121a', '#0d3648']} useAngle={true} angle={-90}>
                    <ScrollView style={[styles.scrollview, styles.bgLayout]} horizontal={true}>
                        <Image style={[styles.bgChild, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgItem, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgInner, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.groupIcon, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild2, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild3, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild4, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild5, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild6, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild7, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild8, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild9, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild10, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild11, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild12, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild13, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild14, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild15, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild16, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild17, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgChild18, styles.childLayout]} resizeMode="cover" />
                        <Text style={[styles.addCash, styles.addFlexBox]}>Add Cash</Text>
                        <Image style={[styles.arrowUpUndefinedGlyph, styles.arrowLayout]} resizeMode="cover" />
                    </ScrollView>
                </LinearGradient>

                <View style={[styles.mainBody, styles.mainBodyLayout]}>
                    <View style={[styles.st, styles.stLayout]}>
                        <View style={[styles.stChild, styles.stLayout]} />
                        <View style={[styles.groupParent, styles.groupPosition]}>
                            <Image style={[styles.groupChild, styles.groupLayout]} resizeMode="cover" />
                            <Text style={[styles.rd, styles.addFlexBox]}>3rd</Text>
                            <Image style={[styles.maskGroupIcon, styles.groupPosition]} resizeMode="cover" />
                        </View>
                        <Text style={[styles.enterAmountManually, styles.enterAmountManuallyTypo]}>Enter Amount Manually</Text>
                    </View>
                    <Text style={[styles.currentBalanceRsContainer, styles.optionsPosition]}>
                        <Text style={styles.currentBalance}>Current Balance:</Text>
                        <Text style={styles.optionsTypo}> Rs 950</Text>
                    </Text>
                    <Text style={[styles.upiOptions, styles.optionsTypo]}>UPI Options</Text>
                    <Text style={[styles.debitcreditCardOptions, styles.optionsTypo]}>Debit/Credit Card Options</Text>
                    <Text style={[styles.walletOptions, styles.optionsTypo]}>Wallet Options</Text>
                    <View style={styles.addCash2}>
                        <Text style={[styles.rs2000, styles.rs20Typo]}>Rs 2,000</Text>
                    </View>
                    <View style={[styles.addCash3, styles.addLayout1]}>
                        <Image style={[styles.image24Icon, styles.iconLayout]} resizeMode="cover" />
                        <Image style={[styles.iosArrowUndefinedGlyph, styles.arrowLayout]} resizeMode="cover" />
                    </View>
                    <View style={[styles.addCash4, styles.addLayout1]}>
                        <Image style={[styles.iosArrowUndefinedGlyph, styles.arrowLayout]} resizeMode="cover" />
                        <Image style={[styles.image26Icon, styles.iconPosition1]} resizeMode="cover" />
                    </View>
                    <View style={[styles.addCash5, styles.addLayout1]}>
                        <Text style={[styles.selectedPaymentOption, styles.iconPosition1]}>Selected Payment Option</Text>
                    </View>
                    <View style={[styles.addCash6, styles.addLayout]}>
                        <Text style={[styles.rs20, styles.rs20Typo]}>Rs 20</Text>
                    </View>
                    <View style={[styles.addCash7, styles.addLayout1]}>
                        <Image style={[styles.image22Icon, styles.iconPosition]} resizeMode="cover" />
                        <Image style={[styles.iosArrowUndefinedGlyph, styles.arrowLayout]} resizeMode="cover" />
                    </View>
                    <View style={[styles.addCash8, styles.addLayout1]}>
                        <Image style={[styles.iosArrowUndefinedGlyph, styles.arrowLayout]} resizeMode="cover" />
                        <Image style={[styles.image25Icon, styles.iconPosition1]} resizeMode="cover" />
                    </View>
                    <View style={[styles.addCash9, styles.addLayout]}>
                        <Text style={[styles.rs200, styles.rs20Typo]}>Rs 200</Text>
                    </View>
                    <View style={[styles.addCash10, styles.addLayout1]}>
                        <Image style={[styles.image23Icon, styles.iconPosition]} resizeMode="cover" />
                        <Image style={[styles.iosArrowUndefinedGlyph, styles.arrowLayout]} resizeMode="cover" />
                    </View>
                    <Image style={[styles.addCashIcon, styles.addPosition]} resizeMode="cover" />
                    <LinearGradient style={[styles.addCash11, styles.addPosition]} locations={[0, 1]} colors={['#ff8b26', '#ef3c00']} useAngle={true} angle={186.36}>
                        <Text style={[styles.addRs200, styles.addFlexBox]}>Add Rs 200</Text>
                    </LinearGradient>
                </View>
            </View>
            {/* </SafeAreaView> */} {/* Original code */}
        </ScreenWrapper>
    );
};


const styles = StyleSheet.create({
    addMoney: {
        flex: 1,
        backgroundColor: "#f4f6f6"
    },
    viewLayout: {
        width: "100%",
        overflow: "hidden"
    },
    bgLayout: {
        maxWidth: 393,
        flexGrow: 0,
        backgroundColor: "transparent",
        width: "100%",
        flex: 1
    },
    childLayout: {
        height: 58,
        width: 28,
        top: 1,
        position: "absolute"
    },
    addFlexBox: {
        textAlign: "left",
        color: "#fff",
        position: "absolute"
    },
    arrowLayout: {
        height: 24,
        width: 24,
        position: "absolute"
    },
    mainBodyLayout: {
        width: 393,
        position: "absolute"
    },
    leftSideLayout: {
        height: 21,
        width: 54,
        left: "50%",
        position: "absolute"
    },
    iconPosition3: {
        maxWidth: "100%",
        top: "50%",
        position: "absolute",
        overflow: "hidden"
    },
    iconPosition2: {
        height: 12,
        left: "50%",
        top: 1,
        position: "absolute"
    },
    stLayout: {
        height: 50,
        width: 363,
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 8,
        backgroundColor: "#fff",
        position: "absolute"
    },
    groupPosition: {
        display: "none",
        position: "absolute"
    },
    groupLayout: {
        height: 26,
        width: 26
    },
    enterAmountManuallyTypo: {
        color: "#828282",
        lineHeight: 22,
        fontSize: 18,
        fontFamily: "Roboto-Regular",
        textAlign: "left"
    },
    optionsPosition: {
        lineHeight: 20,
        marginLeft: -180.5,
        color: "#272f2f",
        fontSize: 16,
        textAlign: "left",
        left: "50%",
        position: "absolute"
    },
    optionsTypo: {
        fontFamily: "Roboto-Bold",
        fontWeight: "700"
    },
    rs20Typo: {
        fontFamily: "Montserrat-SemiBold",
        lineHeight: 20,
        fontWeight: "600",
        fontSize: 16,
        textAlign: "left"
    },
    addLayout1: {
        height: 46,
        borderColor: "#e9e9e9",
        width: 363,
        borderWidth: 1,
        borderStyle: "solid",
        backgroundColor: "#fff",
        left: 15,
        borderRadius: 4,
        position: "absolute"
    },
    iconLayout: {
        height: 27,
        top: 8
    },
    iconPosition1: {
        left: 12,
        position: "absolute"
    },
    addLayout: {
        height: 38,
        width: 105,
        borderColor: "#e3e3e3",
        borderRadius: 22,
        top: 103,
        borderWidth: 1,
        borderStyle: "solid",
        position: "absolute"
    },
    iconPosition: {
        height: 34,
        left: 12,
        position: "absolute"
    },
    addPosition: {
        width: 361,
        left: 16,
        position: "absolute"
    },
    viewBg: {
        backgroundColor: "#f4f6f6",
        flex: 1
    },
    view: {
        height: 830,
        overflow: "hidden",
        backgroundColor: "#f4f6f6",
        flex: 1
    },
    bg: {
        top: 41,
        backgroundColor: "transparent",
        left: 0,
        position: "absolute"
    },
    scrollview: {
        backgroundColor: "transparent"
    },
    bgChild: {
        left: 128
    },
    bgItem: {
        left: 265
    },
    bgInner: {
        left: 38
    },
    groupIcon: {
        left: 156
    },
    bgChild2: {
        left: 294
    },
    bgChild3: {
        left: 66
    },
    bgChild4: {
        left: 185
    },
    bgChild5: {
        left: 322
    },
    bgChild6: {
        left: 95
    },
    bgChild7: {
        left: 213
    },
    bgChild8: {
        left: 351
    },
    bgChild9: {
        left: 123
    },
    bgChild10: {
        left: 242
    },
    bgChild11: {
        left: 379
    },
    bgChild12: {
        left: 152
    },
    bgChild13: {
        left: 270
    },
    bgChild14: {
        left: 407
    },
    bgChild15: {
        left: 180
    },
    bgChild16: {
        left: -2
    },
    bgChild17: {
        left: 10
    },
    bgChild18: {
        left: 364
    },
    addCash: {
        marginLeft: -46.5,
        fontFamily: "OpenSans-Bold",
        fontWeight: "700",
        lineHeight: 24,
        fontSize: 20,
        textAlign: "left",
        left: "50%",
        top: 13
    },
    arrowUpUndefinedGlyph: {
        left: 18,
        top: 13
    },
    statusbar: {
        marginLeft: -196.5,
        backgroundColor: "#010e0f",
        height: 42,
        top: 0,
        left: "50%"
    },
    statusbar2: {
        height: "100%",
        top: "0%",
        right: "0%",
        bottom: "0%",
        left: "0%",
        position: "absolute",
        overflow: "hidden"
    },
    notch: {
        width: 0,
        height: 0
    },
    leftSide: {
        marginLeft: -168.5,
        top: 14
    },
    statusbarTime: {
        marginLeft: -27,
        borderRadius: 24,
        top: 0
    },
    time: {
        letterSpacing: -0.32,
        lineHeight: 21,
        fontFamily: "Inter-SemiBold",
        textAlign: "center",
        height: 20,
        fontWeight: "600",
        fontSize: 16,
        width: 54,
        color: "#fff",
        top: 1,
        left: 0,
        position: "absolute"
    },
    rightSide: {
        marginLeft: 92.5,
        top: 19,
        width: 77,
        height: 13,
        left: "50%",
        position: "absolute"
    },
    statusbarBattery: {
        marginLeft: 11.3,
        width: 27,
        height: 13,
        top: 0,
        left: "50%",
        position: "absolute"
    },
    outlineIcon: {
        marginTop: -6.5,
        right: 2,
        opacity: 0.35,
        borderRadius: 4,
        height: 13,
        left: 0
    },
    batteryEndIcon: {
        marginTop: -1.5,
        right: 0,
        width: 1,
        height: 4,
        opacity: 0.4,
        top: "50%",
        position: "absolute"
    },
    fillIcon: {
        marginTop: -4.5,
        right: 10,
        left: 2,
        borderRadius: 2,
        height: 9
    },
    wifiIcon: {
        marginLeft: -12.7,
        width: 17
    },
    iconMobileSignal: {
        marginLeft: -38.7,
        width: 18
    },
    mainBody: {
        top: 91,
        height: 739,
        left: 0
    },
    st: {
        top: 47,
        borderColor: "#aeb3b6",
        left: 15,
        height: 50,
        width: 363,
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 8,
        overflow: "hidden"
    },
    stChild: {
        marginLeft: -182.5,
        top: -1,
        borderColor: "#b55252",
        left: "50%"
    },
    groupParent: {
        top: -2,
        left: 48,
        height: 26,
        width: 26
    },
    groupChild: {
        top: 0,
        left: 0,
        position: "absolute"
    },
    rd: {
        top: 9,
        left: 6,
        fontSize: 8,
        lineHeight: 8,
        fontWeight: "800",
        fontFamily: "Montserrat-ExtraBold"
    },
    maskGroupIcon: {
        top: 2,
        left: 28,
        width: 41,
        height: 41
    },
    enterAmountManually: {
        left: 46,
        top: 13,
        position: "absolute"
    },
    currentBalanceRsContainer: {
        color: "#272f2f",
        top: 14
    },
    currentBalance: {
        fontFamily: "Roboto-Regular"
    },
    upiOptions: {
        top: 160,
        color: "#272f2f",
        lineHeight: 20,
        marginLeft: -180.5,
        fontSize: 16,
        textAlign: "left",
        left: "50%",
        position: "absolute"
    },
    debitcreditCardOptions: {
        top: 360,
        color: "#272f2f",
        lineHeight: 20,
        marginLeft: -180.5,
        fontSize: 16,
        textAlign: "left",
        left: "50%",
        position: "absolute"
    },
    walletOptions: {
        top: 560,
        color: "#272f2f",
        lineHeight: 20,
        marginLeft: -180.5,
        fontSize: 16,
        textAlign: "left",
        left: "50%",
        position: "absolute"
    },
    addCash2: {
        left: 237,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderColor: "#e3e3e3",
        borderRadius: 22,
        top: 103,
        borderWidth: 1,
        borderStyle: "solid",
        backgroundColor: "#fff",
        position: "absolute"
    },
    rs2000: {
        color: "#272f2f"
    },
    addCash3: {
        top: 295
    },
    image24Icon: {
        left: 14,
        width: 85,
        position: "absolute"
    },
    iosArrowUndefinedGlyph: {
        top: 10,
        left: 321
    },
    addCash4: {
        top: 495
    },
    image26Icon: {
        width: 109,
        height: 27,
        top: 8
    },
    addCash5: {
        top: 589
    },
    selectedPaymentOption: {
        top: 11,
        color: "#828282",
        lineHeight: 22,
        fontSize: 18,
        fontFamily: "Roboto-Regular",
        textAlign: "left"
    },
    addCash6: {
        backgroundColor: "#fff",
        height: 38,
        width: 105,
        left: 15
    },
    rs20: {
        marginLeft: -23.5,
        top: 8,
        color: "#272f2f",
        left: "50%",
        position: "absolute"
    },
    addCash7: {
        top: 191
    },
    image22Icon: {
        marginTop: -18,
        width: 132,
        top: "50%"
    },
    addCash8: {
        top: 391
    },
    image25Icon: {
        width: 80,
        height: 28,
        top: 8
    },
    addCash9: {
        left: 126,
        backgroundColor: "#168de1"
    },
    rs200: {
        marginLeft: -28.5,
        top: 8,
        color: "#fff",
        fontFamily: "Montserrat-SemiBold",
        left: "50%",
        position: "absolute"
    },
    addCash10: {
        top: 243
    },
    image23Icon: {
        top: 5,
        width: 115
    },
    addCashIcon: {
        top: 444,
        height: 44,
        borderRadius: 4
    },
    addCash11: {
        top: 658,
        borderRadius: 40,
        height: 48,
        backgroundColor: "transparent",
        overflow: "hidden"
    },
    addRs200: {
        marginTop: -12,
        marginLeft: -59.5,
        fontFamily: "Montserrat-Bold",
        top: "50%",
        fontWeight: "700",
        lineHeight: 24,
        fontSize: 20,
        textAlign: "left",
        left: "50%"
    }
});

export default AddMoney;
