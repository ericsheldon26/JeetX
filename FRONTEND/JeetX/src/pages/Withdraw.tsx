import * as React from "react";
import { ScrollView, StyleSheet, Text, View, Image as RNImage } from "react-native";
import { scale, verticalScale, moderateScale, hp, wp } from '../utils/responsive';

const Image = (props: any) => <View {...props} style={[{ backgroundColor: 'rgba(255,255,255,0.1)' }, props.style]} ><RNImage {...props} style={{ display: 'none' }} /></View>;
import LinearGradient from "react-native-linear-gradient";
// import { SafeAreaView } from "react-native-safe-area-context"; // Original Windows/Native code
import ScreenWrapper from '../components/ScreenWrapper'; // Linux/NewArch Fix


const Withdraw = () => {

    return (
        /* <SafeAreaView style={styles.viewBg}> */ // Original code
        <ScreenWrapper style={styles.viewBg}>

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
                        <Text style={[styles.withdraw2, styles.withdrawClr]}>Withdraw</Text>
                        <Image style={[styles.arrowUpUndefinedGlyph, styles.frameWrapperPosition]} resizeMode="cover" />
                    </ScrollView>
                </LinearGradient>

                <View style={[styles.mainBody, styles.mainBodyLayout]}>
                    <View style={[styles.st, styles.stLayout]}>
                        <View style={[styles.stChild, styles.stLayout]} />
                        <View style={[styles.groupParent, styles.groupPosition]}>
                            <Image style={[styles.groupChild, styles.groupLayout]} resizeMode="cover" />
                            <Text style={[styles.rd, styles.withdrawClr]}>3rd</Text>
                            <Image style={[styles.maskGroupIcon, styles.groupPosition]} resizeMode="cover" />
                        </View>
                        <Text style={[styles.enterAmountManually, styles.bankLayout]}>$ Enter Amount Manually</Text>
                    </View>
                    <Text style={[styles.totalWinningBalance, styles.amountLayout]}>Total Winning Balance</Text>
                    <Text style={[styles.amount, styles.amountPosition]}>Amount</Text>
                    <Text style={[styles.minimum200, styles.bankTypo]}>Minimum $200 % Maximum $20,000 allowed per day</Text>
                    <Text style={[styles.rs12450, styles.rs12450Typo]}>Rs 12,450</Text>
                    <LinearGradient style={[styles.addCash, styles.addCashLayout]} locations={[0, 1]} colors={['#ff8b26', '#ef3c00']} useAngle={true} angle={186.36}>
                        <Text style={[styles.withdrawRs200, styles.withdrawRs200Position]}>Withdraw Rs 200</Text>
                    </LinearGradient>
                    <View style={styles.rectangleParent}>
                        <View style={[styles.frameChild, styles.addCashLayout]} />
                        <Text style={[styles.bankAccountDetails, styles.rs12450Typo]}>Bank Account Details</Text>
                        <View style={[styles.frameWrapper, styles.frameWrapperPosition]}>
                            <View style={styles.frameContainer}>
                                <View style={styles.frameItem} />
                            </View>
                        </View>
                        <View style={[styles.bankParent, styles.parentFlexBox]}>
                            <Text style={[styles.bank, styles.bankTypo]}>Bank :</Text>
                            <Text style={[styles.bank, styles.bankTypo]}>HDFC Bank</Text>
                        </View>
                        <View style={[styles.accountNoParent, styles.parentFlexBox]}>
                            <Text style={[styles.bank, styles.bankTypo]}>Account No.</Text>
                            <Text style={[styles.bank, styles.bankTypo]}>BEFE1234F</Text>
                        </View>
                        <View style={[styles.ifscParent, styles.parentFlexBox]}>
                            <Text style={[styles.bank, styles.bankTypo]}>IFSC :</Text>
                            <Text style={[styles.bank, styles.bankTypo]}>HDFC00015678</Text>
                        </View>
                        <Image style={[styles.frameInner, styles.groupPosition]} resizeMode="cover" />
                        <View style={[styles.accountHolderParent, styles.parentFlexBox]}>
                            <Text style={[styles.accountHolder, styles.bankTypo]}>{`Account Holder : `}</Text>
                            <Text style={[styles.johnDoe, styles.bankLayout]}>John Doe</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
        /* </SafeAreaView> */ // Original code
    );
};


const styles = StyleSheet.create({
    withdraw: {
        flex: 1,
        backgroundColor: "#f4f6f6"
    },
    viewLayout: {
        width: "100%",
        overflow: "hidden"
    },
    bgLayout: {
        maxWidth: wp(100),
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
    withdrawClr: {
        color: "#fff",
        textAlign: "left"
    },
    frameWrapperPosition: {
        left: 18,
        position: "absolute"
    },
    mainBodyLayout: {
        width: wp(100),
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
    withdrawRs200Position: {
        top: "50%",
        position: "absolute"
    },
    iconPosition: {
        height: 12,
        left: "50%",
        top: 1,
        position: "absolute"
    },
    stLayout: {
        height: 50,
        borderRadius: 8,
        width: 363,
        borderWidth: 1,
        borderStyle: "solid",
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
    bankLayout: {
        lineHeight: 22,
        fontSize: 18
    },
    amountLayout: {
        lineHeight: 20,
        fontSize: 16
    },
    amountPosition: {
        marginLeft: -180.5,
        left: "50%",
        position: "absolute"
    },
    bankTypo: {
        fontFamily: "OpenSans-Regular",
        textAlign: "left"
    },
    rs12450Typo: {
        fontFamily: "Roboto-Bold",
        color: "#272f2f",
        textAlign: "left",
        fontWeight: "700",
        left: "50%",
        position: "absolute"
    },
    addCashLayout: {
        width: 361,
        position: "absolute"
    },
    parentFlexBox: {
        gap: 20,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        left: 18,
        position: "absolute"
    },
    viewBg: {
        backgroundColor: "#f4f6f6",
        flex: 1
    },
    view: {
        height: verticalScale(830),
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
    withdraw2: {
        marginLeft: -scale(49.5),
        fontFamily: "OpenSans-Bold",
        textAlign: "left",
        fontWeight: "700",
        lineHeight: verticalScale(24),
        fontSize: moderateScale(20),
        color: "#fff",
        left: "50%",
        top: verticalScale(13),
        position: "absolute"
    },
    arrowUpUndefinedGlyph: {
        width: 24,
        height: 24,
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
        opacity: 0.4
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
        top: 109,
        left: 15,
        borderColor: "rgba(174, 179, 182, 0.5)",
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
        fontFamily: "Montserrat-ExtraBold",
        textAlign: "left",
        position: "absolute"
    },
    maskGroupIcon: {
        top: 2,
        left: 28,
        width: 41,
        height: 41
    },
    enterAmountManually: {
        left: 14,
        fontFamily: "Poppins-Regular",
        color: "#828282",
        textAlign: "left",
        top: 13,
        position: "absolute"
    },
    totalWinningBalance: {
        marginLeft: -scale(79.5),
        fontFamily: "Roboto-Regular",
        color: "#272f2f",
        top: verticalScale(14),
        textAlign: "left",
        left: "50%",
        position: "absolute"
    },
    amount: {
        top: verticalScale(84),
        fontWeight: "500",
        fontFamily: "Roboto-Medium",
        color: "#272f2f",
        lineHeight: verticalScale(20),
        fontSize: moderateScale(16),
        textAlign: "left"
    },
    minimum200: {
        top: verticalScale(166),
        fontSize: moderateScale(14),
        lineHeight: verticalScale(18),
        color: "#147dc7",
        marginLeft: -scale(180.5),
        left: "50%",
        position: "absolute"
    },
    rs12450: {
        marginLeft: -scale(40.5),
        top: verticalScale(40),
        lineHeight: verticalScale(22),
        fontSize: moderateScale(18)
    },
    addCash: {
        top: 450,
        left: 16,
        borderRadius: 40,
        height: 48,
        backgroundColor: "transparent",
        overflow: "hidden"
    },
    withdrawRs200: {
        marginTop: -verticalScale(12),
        marginLeft: -scale(89.5),
        fontFamily: "Montserrat-Bold",
        textAlign: "left",
        color: "#fff",
        fontWeight: "700",
        lineHeight: verticalScale(24),
        fontSize: moderateScale(20),
        left: "50%"
    },
    rectangleParent: {
        marginLeft: -181.5,
        top: 207,
        borderRadius: 12,
        borderColor: "#aeb3b6",
        height: 196,
        width: 363,
        borderWidth: 1,
        backgroundColor: "#fff",
        borderStyle: "solid",
        left: "50%",
        position: "absolute",
        overflow: "hidden"
    },
    frameChild: {
        backgroundColor: "#f3f3f3",
        borderColor: "#cbcbcb",
        borderBottomWidth: 1,
        height: 44,
        borderStyle: "solid",
        width: 361,
        top: 0,
        left: 0
    },
    bankAccountDetails: {
        marginLeft: -165.5,
        top: 12,
        lineHeight: 20,
        fontSize: 16
    },
    frameWrapper: {
        top: 58
    },
    frameContainer: {
        alignSelf: "stretch",
        alignItems: "flex-end",
        flexWrap: "wrap",
        alignContent: "flex-end",
        flexDirection: "row"
    },
    frameItem: {
        height: 22,
        width: 144
    },
    bankParent: {
        top: 90,
        width: 325,
        justifyContent: "space-between",
        alignItems: "center"
    },
    bank: {
        color: "#272f2f",
        lineHeight: 22,
        fontSize: 18
    },
    accountNoParent: {
        top: 122,
        width: 325,
        justifyContent: "space-between",
        alignItems: "center"
    },
    ifscParent: {
        top: 154,
        width: 326
    },
    frameInner: {
        top: 6,
        left: 311,
        width: 32,
        height: 32
    },
    accountHolderParent: {
        width: 325,
        justifyContent: "space-between",
        alignItems: "center",
        top: 58
    },
    accountHolder: {
        width: 144,
        color: "#272f2f",
        lineHeight: 22,
        fontSize: 18
    },
    johnDoe: {
        fontFamily: "OpenSans-SemiBold",
        color: "#272f2f",
        fontWeight: "600",
        textAlign: "left"
    }
});

export default Withdraw;
