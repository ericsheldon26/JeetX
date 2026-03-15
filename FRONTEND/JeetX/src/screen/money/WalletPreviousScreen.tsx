import * as React from "react";
import { ScrollView, StyleSheet, Text, View, Image as RNImage } from "react-native";

const Image = (props: any) => <View {...props} style={[{ backgroundColor: 'rgba(255,255,255,0.1)' }, props.style]} ><RNImage {...props} style={{ display: 'none' }} /></View>;
import LinearGradient from "react-native-linear-gradient";
// import { SafeAreaView } from "react-native-safe-area-context"; // Original Windows/Native code
import ScreenWrapper from "../../components/ScreenWrapper"; // Linux/NewArch Fix


const WalletPreviousScreen = () => {

    return (

        <ScreenWrapper 
          style={[styles.walletPreviousScreen, styles.viewFlexBox]}
          statusBarColor="#010e0f"
          statusBarStyle="light-content"
          backgroundColor="#f4f6f6"
        >
            {/* <SafeAreaView style={[styles.walletPreviousScreen, styles.viewFlexBox]}> */} {/* Original code */}

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
                        <Text style={[styles.wallet, styles.rdFlexBox]}>Wallet</Text>
                        <Image style={[styles.arrowUpUndefinedGlyph, styles.arrowLayout]} resizeMode="cover" />
                    </ScrollView>
                </LinearGradient>

                <View style={[styles.mainBody, styles.mainBodyLayout]}>
                    <View style={[styles.rectangleParent, styles.stChildLayout]}>
                        <View style={[styles.frameChild, styles.framePosition1]} />
                        <Text style={[styles.currentBalance, styles.myKycDetailsTypo]}>Current Balance</Text>
                        <Text style={[styles.rs450, styles.rs450Typo]}>Rs 450</Text>
                        <Image style={[styles.iosArrowUndefinedGlyph, styles.iconMobileSignalLayout]} resizeMode="cover" />
                        <View style={[styles.frameParent, styles.framePosition]}>
                            <View style={[styles.frameGroup, styles.frameFlexBox]}>
                                <View style={styles.frameContainer}>
                                    <View style={[styles.totalParent, styles.parentFlexBox]}>
                                        <Text style={[styles.total, styles.rs450Typo]}>Total :</Text>
                                        <Text style={[styles.total, styles.rs450Typo]}>Rs 950</Text>
                                    </View>
                                    <Text style={[styles.unutilized, styles.unutilizedFlexBox]}>Unutilized :</Text>
                                </View>
                                <Text style={[styles.winning, styles.rs450Typo]}>Winning :</Text>
                                <Text style={[styles.winning, styles.rs450Typo]}>Rs 500</Text>
                            </View>
                            <View style={[styles.addCashParent, styles.parentFlexBox]}>
                                <LinearGradient style={[styles.addCash, styles.addLayout]} locations={[0, 1]} colors={['#ff8b26', '#ef3c00']} useAngle={true} angle={186.36}>
                                    <Text style={[styles.addCash2, styles.addCash2Typo]}>Add Cash</Text>
                                    <Image style={[styles.addUndefinedGlyphUndef, styles.undefinedLayout]} resizeMode="cover" />
                                </LinearGradient>
                                <View style={[styles.addCash3, styles.addLayout]}>
                                    <Text style={[styles.withdraw, styles.addCash2Typo]}>Withdraw</Text>
                                    <Image style={[styles.arrowUpUndefinedGlyph2, styles.undefinedLayout]} resizeMode="cover" />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.rectangleGroup, styles.stBorder]}>
                        <View style={[styles.frameItem, styles.framePosition1]} />
                        <Text style={[styles.myKycDetails, styles.myKycDetailsTypo]}>My KYC Details</Text>
                        <View style={[styles.frameWrapper, styles.framePosition]}>
                            <View style={styles.frameFlexBox}>
                                <View style={styles.mobile91Xxxx12334Wrapper}>
                                    <Text style={styles.unutilizedFlexBox}>
                                        <Text style={styles.panTypo}>Mobile</Text>
                                        <Text style={styles.text}>{` : `}</Text>
                                        <Text style={styles.xxxx12334}>+91-XXXX12334</Text>
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <Text style={[styles.email, styles.emailPosition]}>Email :</Text>
                        <Text style={[styles.pan, styles.panPosition]}>PAN :</Text>
                        <Text style={[styles.bankAc, styles.text2Position]}>Bank A/C :</Text>
                        <Text style={[styles.jhonemailcom, styles.emailPosition]}>Jhon@email.com</Text>
                        <Text style={[styles.befe1234f, styles.panPosition]}>BEFE1234F</Text>
                        <Text style={[styles.text2, styles.text2Position]}>**********5678</Text>
                        <Image style={styles.frameInner} resizeMode="cover" />
                    </View>
                    <View style={[styles.st, styles.stBorder]}>
                        <View style={[styles.stChild, styles.stItemPosition]} />
                        <View style={[styles.stItem, styles.stItemPosition]} />
                        <View style={[styles.groupParent, styles.groupPosition]}>
                            <Image style={[styles.groupChild, styles.groupLayout]} resizeMode="cover" />
                            <Text style={[styles.rd, styles.rdFlexBox]}>3rd</Text>
                            <Image style={[styles.maskGroupIcon, styles.groupPosition]} resizeMode="cover" />
                        </View>
                        <Text style={[styles.myTransactions, styles.rs450Typo]}>My Transactions</Text>
                        <Image style={[styles.iosArrowUndefinedGlyph2, styles.arrowLayout]} resizeMode="cover" />
                    </View>
                </View>
            </View>
            {/* </SafeAreaView> */} {/* Original code */}
        </ScreenWrapper>
    );
};



const styles = StyleSheet.create({
    walletPreviousScreen: {
        backgroundColor: "#f4f6f6"
    },
    viewFlexBox: {
        flex: 1,
        backgroundColor: "#f4f6f6"
    },
    viewLayout: {
        overflow: "hidden",
        width: "100%"
    },
    bgLayout: {
        maxWidth: 393,
        flexGrow: 0,
        backgroundColor: "transparent",
        width: "100%",
        flex: 1
    },
    childLayout: {
        width: 28,
        top: 1,
        height: 58,
        position: "absolute"
    },
    rdFlexBox: {
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
    iconPosition1: {
        maxWidth: "100%",
        top: "50%",
        position: "absolute",
        overflow: "hidden"
    },
    iconPosition: {
        height: 12,
        left: "50%",
        top: 1
    },
    iconMobileSignalLayout: {
        width: 18,
        position: "absolute"
    },
    stChildLayout: {
        width: 355,
        borderWidth: 1,
        borderStyle: "solid",
        backgroundColor: "#0b1f34"
    },
    framePosition1: {
        height: 44,
        width: 353,
        borderBottomWidth: 1,
        borderStyle: "solid",
        backgroundColor: "#0b1f34",
        top: 0,
        left: 0,
        position: "absolute"
    },
    myKycDetailsTypo: {
        fontFamily: "Roboto-Bold",
        position: "absolute"
    },
    rs450Typo: {
        lineHeight: 22,
        fontSize: 18,
        textAlign: "left",
        color: "#fff"
    },
    framePosition: {
        top: 58,
        width: 317,
        left: 18,
        position: "absolute"
    },
    frameFlexBox: {
        alignContent: "flex-end",
        flexWrap: "wrap",
        alignItems: "flex-end",
        flexDirection: "row",
        alignSelf: "stretch"
    },
    parentFlexBox: {
        alignItems: "center",
        flexDirection: "row",
        alignSelf: "stretch"
    },
    unutilizedFlexBox: {
        alignSelf: "stretch",
        lineHeight: 22,
        fontSize: 18,
        textAlign: "left",
        color: "#fff"
    },
    addLayout: {
        borderRadius: 8,
        width: 153,
        height: 48,
        overflow: "hidden"
    },
    addCash2Typo: {
        fontFamily: "Montserrat-SemiBold",
        marginTop: -10,
        lineHeight: 20,
        top: "50%",
        fontWeight: "600",
        fontSize: 16,
        textAlign: "left",
        left: "50%",
        position: "absolute"
    },
    undefinedLayout: {
        width: 20,
        height: 20,
        top: 14,
        position: "absolute"
    },
    stBorder: {
        borderColor: "#1c4169",
        width: 355,
        borderWidth: 1,
        borderStyle: "solid",
        backgroundColor: "#0b1f34",
        borderRadius: 12,
        position: "absolute",
        overflow: "hidden"
    },
    emailPosition: {
        top: 90,
        lineHeight: 22,
        fontSize: 18,
        textAlign: "left",
        color: "#fff",
        position: "absolute"
    },
    panPosition: {
        top: 122,
        lineHeight: 22,
        fontSize: 18,
        textAlign: "left",
        color: "#fff",
        position: "absolute"
    },
    text2Position: {
        top: 154,
        lineHeight: 22,
        fontSize: 18,
        textAlign: "left",
        color: "#fff",
        position: "absolute"
    },
    stItemPosition: {
        left: -1,
        position: "absolute"
    },
    groupPosition: {
        display: "none",
        top: 2,
        position: "absolute"
    },
    groupLayout: {
        height: 26,
        width: 26
    },
    view: {
        height: 830,
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
        left: 128,
        height: 58
    },
    bgItem: {
        left: 265,
        height: 58
    },
    bgInner: {
        left: 38,
        height: 58
    },
    groupIcon: {
        left: 156,
        height: 58
    },
    bgChild2: {
        left: 294,
        height: 58
    },
    bgChild3: {
        left: 66,
        height: 58
    },
    bgChild4: {
        left: 185,
        height: 58
    },
    bgChild5: {
        left: 322,
        height: 58
    },
    bgChild6: {
        left: 95,
        height: 58
    },
    bgChild7: {
        left: 213,
        height: 58
    },
    bgChild8: {
        left: 351,
        height: 58
    },
    bgChild9: {
        left: 123,
        height: 58
    },
    bgChild10: {
        left: 242,
        height: 58
    },
    bgChild11: {
        left: 379,
        height: 58
    },
    bgChild12: {
        left: 152,
        height: 58
    },
    bgChild13: {
        left: 270,
        height: 58
    },
    bgChild14: {
        left: 407,
        height: 58
    },
    bgChild15: {
        left: 180,
        height: 58
    },
    bgChild16: {
        left: -2,
        height: 58
    },
    bgChild17: {
        left: 10,
        height: 58
    },
    bgChild18: {
        left: 364,
        height: 58
    },
    wallet: {
        marginLeft: -32.5,
        fontSize: 20,
        lineHeight: 24,
        fontFamily: "OpenSans-Bold",
        fontWeight: "700",
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
        position: "absolute"
    },
    notch: {
        width: 0,
        height: 0
    },
    leftSide: {
        marginLeft: -168.5,
        top: 14,
        height: 21,
        width: 54
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
        fontSize: 16,
        fontWeight: "600",
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
        borderRadius: 4,
        opacity: 0.35,
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
        width: 17,
        position: "absolute"
    },
    iconMobileSignal: {
        marginLeft: -38.7,
        height: 12,
        left: "50%",
        top: 1
    },
    mainBody: {
        top: 91,
        height: 739,
        left: 0
    },
    rectangleParent: {
        top: 23,
        borderColor: "#315a86",
        height: 230,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: "solid",
        backgroundColor: "#0b1f34",
        marginLeft: -177.5,
        left: "50%",
        position: "absolute",
        overflow: "hidden"
    },
    frameChild: {
        borderColor: "#15375c"
    },
    currentBalance: {
        marginLeft: -137.5,
        lineHeight: 20,
        top: 12,
        fontFamily: "Roboto-Bold",
        fontSize: 16,
        textAlign: "left",
        color: "#fff",
        fontWeight: "700",
        left: "50%"
    },
    rs450: {
        marginLeft: 101.5,
        top: 89,
        fontFamily: "OpenSans-Regular",
        left: "50%",
        position: "absolute"
    },
    iosArrowUndefinedGlyph: {
        left: 16,
        height: 18,
        top: 13
    },
    frameParent: {
        gap: 20,
        width: 317
    },
    frameGroup: {
        rowGap: 10,
        columnGap: 181
    },
    frameContainer: {
        gap: 10,
        width: 317
    },
    totalParent: {
        justifyContent: "space-between",
        gap: 20
    },
    total: {
        fontFamily: "OpenSans-Bold",
        fontWeight: "700"
    },
    unutilized: {
        fontFamily: "OpenSans-Regular"
    },
    winning: {
        fontFamily: "OpenSans-Regular"
    },
    addCashParent: {
        gap: 11
    },
    addCash: {
        backgroundColor: "transparent"
    },
    addCash2: {
        marginLeft: -26.5,
        color: "#fff",
        fontFamily: "Montserrat-SemiBold",
        marginTop: -10
    },
    addUndefinedGlyphUndef: {
        left: 24
    },
    addCash3: {
        backgroundColor: "#f4f6f6"
    },
    withdraw: {
        marginLeft: -28.5,
        color: "#272f2f"
    },
    arrowUpUndefinedGlyph2: {
        left: 22
    },
    rectangleGroup: {
        top: 343,
        height: 196,
        marginLeft: -177.5,
        borderColor: "#1c4169",
        left: "50%"
    },
    frameItem: {
        borderColor: "#143351"
    },
    myKycDetails: {
        marginLeft: -161.5,
        lineHeight: 20,
        top: 12,
        fontFamily: "Roboto-Bold",
        fontSize: 16,
        textAlign: "left",
        color: "#fff",
        fontWeight: "700",
        left: "50%"
    },
    frameWrapper: {
        width: 317
    },
    mobile91Xxxx12334Wrapper: {
        width: 317
    },
    panTypo: {
        fontFamily: "OpenSans-Light",
        fontWeight: "300"
    },
    text: {
        fontFamily: "OpenSans-Regular"
    },
    xxxx12334: {
        fontFamily: "OpenSans-SemiBold",
        fontWeight: "600"
    },
    email: {
        fontFamily: "OpenSans-Light",
        fontWeight: "300",
        left: 18
    },
    pan: {
        fontFamily: "OpenSans-Light",
        fontWeight: "300",
        left: 18
    },
    bankAc: {
        fontFamily: "OpenSans-Light",
        fontWeight: "300",
        left: 18
    },
    jhonemailcom: {
        left: 82,
        fontFamily: "OpenSans-Regular"
    },
    befe1234f: {
        left: 70,
        fontFamily: "OpenSans-Regular"
    },
    text2: {
        left: 110,
        fontFamily: "OpenSans-Regular"
    },
    frameInner: {
        top: 6,
        left: 305,
        width: 32,
        height: 32,
        position: "absolute"
    },
    st: {
        top: 269,
        left: 19,
        height: 58
    },
    stChild: {
        top: -1,
        borderRadius: 10,
        borderColor: "#b55252",
        width: 355,
        borderWidth: 1,
        borderStyle: "solid",
        backgroundColor: "#0b1f34",
        height: 58
    },
    stItem: {
        top: -4,
        width: 112,
        height: 64
    },
    groupParent: {
        left: 44,
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
        left: 28,
        width: 41,
        height: 41
    },
    myTransactions: {
        top: 17,
        fontFamily: "Roboto-Bold",
        position: "absolute",
        fontWeight: "600",
        left: 18
    },
    iosArrowUndefinedGlyph2: {
        top: 16,
        left: 311
    }
});

export default WalletPreviousScreen;
