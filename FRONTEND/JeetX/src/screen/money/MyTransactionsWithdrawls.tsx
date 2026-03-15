import * as React from "react";
import { ScrollView, StyleSheet, Text, View, Image as RNImage, Pressable } from "react-native";

const Image = (props: any) => <View {...props} style={[{ backgroundColor: 'rgba(255,255,255,0.1)' }, props.style]} ><RNImage {...props} style={{ display: 'none' }} /></View>;
import LinearGradient from "react-native-linear-gradient";
// import { SafeAreaView } from "react-native-safe-area-context"; // Original Windows/Native code
import ScreenWrapper from "../../components/ScreenWrapper"; // Linux/NewArch Fix


const MyTransactionsWithdrawls = () => {

    return (

        <ScreenWrapper 
          style={[styles.myTransactionswithdrawls, styles.viewFlexBox]}
          statusBarColor="#010e0f"
          statusBarStyle="light-content"
          backgroundColor="#f4f6f6"
        >
            {/* <SafeAreaView style={[styles.myTransactionswithdrawls, styles.viewFlexBox]}> */} {/* Original code */}

            <View style={[styles.view, styles.viewLayout]}>
                <LinearGradient style={[styles.bg, styles.bgLayout]} locations={[0, 1]} colors={['#02121a', '#0d3648']} useAngle={true} angle={-90}>
                    <ScrollView style={styles.bgLayout} horizontal={true}>
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
                        <Text style={[styles.myTransactions, styles.rdClr]}>My Transactions</Text>
                        <Image style={[styles.arrowUpUndefinedGlyph, styles.arrowLayout]} resizeMode="cover" />
                    </ScrollView>
                </LinearGradient>

                <View style={[styles.mainBody, styles.mainBodyLayout]}>
                    <View style={styles.categories}>
                        <ScrollView style={styles.frameParent} horizontal={true} contentContainerStyle={styles.frameContainerContent}>
                            <View style={styles.frameWrapper}>
                                <View style={styles.appsFlexBox}>
                                    <Image style={[styles.appsUndefinedGlyphUnde, styles.arrowLayout]} resizeMode="cover" />
                                    <Text style={styles.contests}>Contests</Text>
                                </View>
                            </View>
                            <Pressable style={styles.frameWrapper} onPress={() => { }}>
                                <View style={[styles.appsUndefinedGlyphUndeGroup, styles.appsFlexBox]}>
                                    <Image style={[styles.appsUndefinedGlyphUnde, styles.arrowLayout]} resizeMode="cover" />
                                    <Image style={[styles.appsUndefinedGlyphUnde, styles.arrowLayout]} resizeMode="cover" />
                                    <Image style={[styles.appsUndefinedGlyphUnde, styles.arrowLayout]} resizeMode="cover" />
                                    <Image style={[styles.appsUndefinedGlyphUnde, styles.arrowLayout]} resizeMode="cover" />
                                    <Text style={styles.withdrawals}>Withdrawals</Text>
                                </View>
                            </Pressable>
                            <View style={styles.frameWrapper}>
                                <View style={[styles.appsUndefinedGlyphUndeGroup, styles.appsFlexBox]}>
                                    <Image style={[styles.appsUndefinedGlyphUnde, styles.arrowLayout]} resizeMode="cover" />
                                    <Image style={[styles.appsUndefinedGlyphUnde, styles.arrowLayout]} resizeMode="cover" />
                                    <Text style={styles.contests}>Deposits</Text>
                                </View>
                            </View>
                            <View style={styles.frameWrapper}>
                                <View style={[styles.appsUndefinedGlyphUndeGroup, styles.appsFlexBox]}>
                                    <Image style={[styles.appsUndefinedGlyphUnde, styles.arrowLayout]} resizeMode="cover" />
                                    <Image style={[styles.appsUndefinedGlyphUnde, styles.arrowLayout]} resizeMode="cover" />
                                    <Image style={[styles.appsUndefinedGlyphUnde, styles.arrowLayout]} resizeMode="cover" />
                                    <Text style={styles.contests}>TDS</Text>
                                </View>
                            </View>
                        </ScrollView>
                        <View style={[styles.categoriesChild, styles.batteryEndIconLayout]} />
                    </View>
                    <View style={[styles.addCash, styles.addBorder]}>
                        <Text style={[styles.refund, styles.textClr]}>Refund</Text>
                    </View>
                    <Text style={[styles.transactionsMayTake, styles.july2025415pmTypo]}>Transactions may take 15min to reflect here.</Text>
                    <View style={[styles.addCash2, styles.addBorder]}>
                        <Text style={[styles.refund, styles.textClr]}>In-process</Text>
                    </View>
                    <View style={[styles.addCash3, styles.addBorder]}>
                        <Text style={[styles.refund, styles.textClr]}>Success</Text>
                    </View>
                    <View style={[styles.addCash4, styles.addBorder]}>
                        <Text style={[styles.refund, styles.textClr]}>Failed</Text>
                    </View>
                    <View style={[styles.st, styles.stLayout]}>
                        <View style={[styles.stChild, styles.stLayout]} />
                        <View style={[styles.groupParent, styles.groupLayout]}>
                            <Image style={[styles.groupChild, styles.groupLayout]} resizeMode="cover" />
                            <Text style={[styles.rd, styles.rdPosition]}>3rd</Text>
                            <Image style={styles.maskGroupIcon} resizeMode="cover" />
                        </View>
                        <Text style={[styles.july2025415pm, styles.amountPosition]}>23 July 2025, 4:15PM</Text>
                        <Text style={[styles.amount, styles.amountPosition]}>Amount:</Text>
                        <Text style={[styles.text, styles.textClr]}>₹ 200</Text>
                        <Text style={styles.success2}>Success</Text>
                        <View style={[styles.rectangleParent, styles.groupItemLayout]}>
                            <View style={[styles.groupItem, styles.groupItemLayout]} />
                            <Image style={[styles.arrowUpRightUndefinedG, styles.rdPosition]} resizeMode="cover" />
                        </View>
                    </View>
                    <View style={[styles.st2, styles.stLayout]}>
                        <View style={[styles.stChild, styles.stLayout]} />
                        <View style={[styles.groupParent, styles.groupLayout]}>
                            <Image style={[styles.groupChild, styles.groupLayout]} resizeMode="cover" />
                            <Text style={[styles.rd, styles.rdPosition]}>3rd</Text>
                            <Image style={styles.maskGroupIcon} resizeMode="cover" />
                        </View>
                        <Text style={[styles.july2025415pm, styles.amountPosition]}>23 July 2025, 4:15PM</Text>
                        <Text style={[styles.amount, styles.amountPosition]}>Amount:</Text>
                        <Text style={[styles.text, styles.textClr]}>₹ 200</Text>
                        <Text style={styles.success2}>Success</Text>
                        <View style={[styles.rectangleParent, styles.groupItemLayout]}>
                            <View style={[styles.groupItem, styles.groupItemLayout]} />
                            <Image style={[styles.arrowUpRightUndefinedG, styles.rdPosition]} resizeMode="cover" />
                        </View>
                    </View>
                    <View style={[styles.st3, styles.stLayout]}>
                        <View style={[styles.stChild, styles.stLayout]} />
                        <View style={[styles.groupParent, styles.groupLayout]}>
                            <Image style={[styles.groupChild, styles.groupLayout]} resizeMode="cover" />
                            <Text style={[styles.rd, styles.rdPosition]}>3rd</Text>
                            <Image style={styles.maskGroupIcon} resizeMode="cover" />
                        </View>
                        <Text style={[styles.july2025415pm, styles.amountPosition]}>23 July 2025, 4:15PM</Text>
                        <Text style={[styles.amount, styles.amountPosition]}>Amount:</Text>
                        <Text style={[styles.text, styles.textClr]}>₹ 500</Text>
                        <Text style={[styles.inProcess2, styles.failed2Typo]}>In-Process</Text>
                        <View style={[styles.rectangleParent, styles.groupItemLayout]}>
                            <View style={[styles.groupItem, styles.groupItemLayout]} />
                        </View>
                        <Image style={[styles.historyUndefinedGlyphU, styles.transactionsMayTakePosition]} resizeMode="cover" />
                    </View>
                    <View style={[styles.st4, styles.stLayout]}>
                        <View style={[styles.stChild, styles.stLayout]} />
                        <View style={[styles.groupParent, styles.groupLayout]}>
                            <Image style={[styles.groupChild, styles.groupLayout]} resizeMode="cover" />
                            <Text style={[styles.rd, styles.rdPosition]}>3rd</Text>
                            <Image style={styles.maskGroupIcon} resizeMode="cover" />
                        </View>
                        <Text style={[styles.july2025415pm, styles.amountPosition]}>23 July 2025, 4:15PM</Text>
                        <Text style={[styles.amount, styles.amountPosition]}>Amount:</Text>
                        <Text style={[styles.text, styles.textClr]}>₹ 500</Text>
                        <Text style={[styles.failed2, styles.failed2Typo]}>Failed</Text>
                        <View style={[styles.rectangleParent, styles.groupItemLayout]}>
                            <View style={[styles.groupItem, styles.groupItemLayout]} />
                            <Image style={[styles.arrowUpRightUndefinedG, styles.rdPosition]} resizeMode="cover" />
                        </View>
                    </View>
                    <View style={[styles.st5, styles.stLayout]}>
                        <View style={[styles.stChild, styles.stLayout]} />
                        <View style={[styles.groupParent, styles.groupLayout]}>
                            <Image style={[styles.groupChild, styles.groupLayout]} resizeMode="cover" />
                            <Text style={[styles.rd, styles.rdPosition]}>3rd</Text>
                            <Image style={styles.maskGroupIcon} resizeMode="cover" />
                        </View>
                        <Text style={[styles.july2025415pm, styles.amountPosition]}>23 July 2025, 4:15PM</Text>
                        <Text style={[styles.amount, styles.amountPosition]}>Amount:</Text>
                        <Text style={[styles.text, styles.textClr]}>₹ 500</Text>
                        <Text style={[styles.failed2, styles.failed2Typo]}>Failed</Text>
                        <View style={[styles.rectangleParent, styles.groupItemLayout]}>
                            <View style={[styles.groupItem, styles.groupItemLayout]} />
                            <Image style={[styles.arrowUpRightUndefinedG, styles.rdPosition]} resizeMode="cover" />
                        </View>
                    </View>
                    <View style={[styles.st6, styles.stLayout]}>
                        <View style={[styles.stChild, styles.stLayout]} />
                        <View style={[styles.groupParent, styles.groupLayout]}>
                            <Image style={[styles.groupChild, styles.groupLayout]} resizeMode="cover" />
                            <Text style={[styles.rd, styles.rdPosition]}>3rd</Text>
                            <Image style={styles.maskGroupIcon} resizeMode="cover" />
                        </View>
                        <Text style={[styles.july2025415pm, styles.amountPosition]}>23 July 2025, 4:15PM</Text>
                        <Text style={[styles.amount, styles.amountPosition]}>Amount:</Text>
                        <Text style={[styles.text, styles.textClr]}>₹ 300</Text>
                        <Text style={[styles.refund2, styles.failed2Typo]}>Refund</Text>
                        <View style={[styles.rectangleParent, styles.groupItemLayout]}>
                            <View style={[styles.groupItem, styles.groupItemLayout]} />
                            <Image style={[styles.arrowUpRightUndefinedG, styles.rdPosition]} resizeMode="cover" />
                        </View>
                    </View>
                </View>
            </View>
            {/* </SafeAreaView> */} {/* Original code */}
        </ScreenWrapper>

    );
};


const styles = StyleSheet.create({
    frameContainerContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    myTransactionswithdrawls: {
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
        backgroundColor: "transparent",
        maxWidth: 393,
        flexGrow: 0,
        width: "100%",
        flex: 1
    },
    childLayout: {
        height: 58,
        width: 28,
        top: 1,
        position: "absolute"
    },
    rdClr: {
        color: "#fff",
        textAlign: "left"
    },
    arrowLayout: {
        height: 24,
        width: 24
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
    timeTypo: {
        fontWeight: "600",
        position: "absolute"
    },
    rightSidePosition: {
        left: "50%",
        position: "absolute"
    },
    iconPosition1: {
        maxWidth: "100%",
        top: "50%",
        position: "absolute",
        overflow: "hidden"
    },
    batteryEndIconLayout: {
        height: 4,
        position: "absolute"
    },
    iconPosition: {
        height: 12,
        left: "50%",
        top: 1,
        position: "absolute"
    },
    appsFlexBox: {
        gap: 6,
        alignItems: "center",
        flexDirection: "row"
    },
    addBorder: {
        paddingHorizontal: 16,
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#e3e3e3",
        borderRadius: 22,
        top: 55,
        alignItems: "center",
        flexDirection: "row",
        paddingVertical: 8,
        borderStyle: "solid",
        backgroundColor: "#fff",
        position: "absolute"
    },
    textClr: {
        color: "#272f2f",
        textAlign: "left"
    },
    july2025415pmTypo: {
        fontSize: 14,
        fontFamily: "OpenSans-Regular"
    },
    stLayout: {
        height: 85,
        width: 363,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: "solid",
        backgroundColor: "#fff",
        left: "50%",
        position: "absolute"
    },
    groupLayout: {
        height: 26,
        width: 26,
        position: "absolute"
    },
    rdPosition: {
        left: 6,
        position: "absolute"
    },
    amountPosition: {
        left: 58,
        color: "#272f2f",
        textAlign: "left",
        position: "absolute"
    },
    groupItemLayout: {
        height: 36,
        width: 36,
        position: "absolute"
    },
    failed2Typo: {
        textAlign: "right",
        fontFamily: "Roboto-Bold",
        top: 15,
        lineHeight: 20,
        fontWeight: "600",
        fontSize: 16,
        position: "absolute"
    },
    transactionsMayTakePosition: {
        left: 16,
        position: "absolute"
    },
    view: {
        height: 830,
        backgroundColor: "#f4f6f6",
        flex: 1
    },
    bg: {
        top: 41,
        left: 0,
        position: "absolute"
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
    myTransactions: {
        marginLeft: -81.5,
        fontFamily: "OpenSans-Bold",
        textAlign: "left",
        fontWeight: "700",
        lineHeight: 24,
        fontSize: 20,
        left: "50%",
        position: "absolute",
        top: 13
    },
    arrowUpUndefinedGlyph: {
        left: 18,
        top: 13,
        position: "absolute"
    },
    statusbar: {
        backgroundColor: "#010e0f",
        height: 42,
        top: 0,
        marginLeft: -196.5,
        width: 393,
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
        fontSize: 16,
        width: 54,
        fontWeight: "600",
        color: "#fff",
        top: 1,
        left: 0
    },
    rightSide: {
        marginLeft: 92.5,
        top: 19,
        width: 77,
        height: 13
    },
    statusbarBattery: {
        marginLeft: 11.3,
        width: 27,
        height: 13,
        top: 0
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
        opacity: 0.4,
        top: "50%",
        height: 4
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
    categories: {
        elevation: 2,
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 2,
        shadowOpacity: 1,
        borderColor: "#ebebeb",
        borderBottomWidth: 1,
        height: 44,
        borderStyle: "solid",
        backgroundColor: "#fff",
        width: 393,
        top: 0,
        marginLeft: -196.5,
        left: "50%",
        position: "absolute",
        overflow: "hidden"
    },
    frameParent: {
        top: 4,
        left: 8,
        width: 385,
        maxWidth: 385,
        flexGrow: 0,
        position: "absolute",
        flex: 1
    },
    frameWrapper: {
        paddingHorizontal: 12,
        paddingVertical: 8
    },
    appsUndefinedGlyphUnde: {
        display: "none"
    },
    contests: {
        color: "#728181",
        fontFamily: "OpenSans-Regular",
        lineHeight: 20,
        fontSize: 16,
        textAlign: "left"
    },
    appsUndefinedGlyphUndeGroup: {
        alignSelf: "stretch"
    },
    withdrawals: {
        fontFamily: "Montserrat-Bold",
        color: "#008d9d",
        lineHeight: 20,
        fontSize: 16,
        textAlign: "left",
        fontWeight: "700"
    },
    categoriesChild: {
        top: 39,
        left: 104,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        backgroundColor: "#008d9d",
        width: 119
    },
    addCash: {
        left: 15
    },
    refund: {
        fontSize: 15,
        fontWeight: "500",
        fontFamily: "Montserrat-Medium",
        lineHeight: 20
    },
    transactionsMayTake: {
        top: 102,
        left: 16,
        position: "absolute",
        color: "#272f2f",
        textAlign: "left",
        lineHeight: 20
    },
    addCash2: {
        left: 212
    },
    addCash3: {
        left: 111
    },
    addCash4: {
        left: 331
    },
    st: {
        top: 139,
        borderColor: "#e6e6e6",
        marginLeft: -181.5,
        width: 363,
        borderRadius: 8,
        overflow: "hidden"
    },
    stChild: {
        marginLeft: -182.5,
        top: -1,
        borderColor: "#b55252",
        width: 363,
        borderRadius: 8
    },
    groupParent: {
        top: -2,
        left: 48,
        display: "none"
    },
    groupChild: {
        top: 0,
        left: 0
    },
    rd: {
        top: 9,
        fontSize: 8,
        lineHeight: 8,
        fontWeight: "800",
        fontFamily: "Montserrat-ExtraBold",
        textAlign: "left",
        color: "#fff"
    },
    maskGroupIcon: {
        top: 2,
        left: 28,
        width: 41,
        height: 41,
        display: "none",
        position: "absolute"
    },
    july2025415pm: {
        top: 16,
        lineHeight: 18,
        fontSize: 14,
        fontFamily: "OpenSans-Regular"
    },
    amount: {
        top: 47,
        fontFamily: "Roboto-Regular",
        lineHeight: 20,
        fontSize: 16
    },
    text: {
        top: 45,
        left: 291,
        letterSpacing: -1,
        fontFamily: "OpenSans-SemiBold",
        fontWeight: "600",
        position: "absolute",
        lineHeight: 24,
        fontSize: 20
    },
    success2: {
        left: 277,
        color: "#007021",
        fontFamily: "Roboto-Bold",
        top: 15,
        lineHeight: 20,
        fontWeight: "600",
        fontSize: 16,
        textAlign: "left",
        position: "absolute"
    },
    rectangleParent: {
        top: 14,
        left: 10
    },
    groupItem: {
        borderRadius: 9,
        top: 0,
        left: 0,
        backgroundColor: "#f4f6f6"
    },
    arrowUpRightUndefinedG: {
        top: 6,
        height: 24,
        width: 24
    },
    st2: {
        top: 511,
        borderColor: "#e6e6e6",
        marginLeft: -181.5,
        width: 363,
        borderRadius: 8,
        overflow: "hidden"
    },
    st3: {
        top: 232,
        borderColor: "#e6e6e6",
        marginLeft: -181.5,
        width: 363,
        borderRadius: 8,
        overflow: "hidden"
    },
    inProcess2: {
        left: 260,
        color: "#cf8712"
    },
    historyUndefinedGlyphU: {
        top: 20,
        height: 24,
        width: 24
    },
    st4: {
        top: 325,
        borderColor: "#e6e6e6",
        marginLeft: -181.5,
        width: 363,
        borderRadius: 8,
        overflow: "hidden"
    },
    failed2: {
        color: "#cf1212",
        left: 294
    },
    st5: {
        top: 604,
        borderColor: "#e6e6e6",
        marginLeft: -181.5,
        width: 363,
        borderRadius: 8,
        overflow: "hidden"
    },
    st6: {
        top: 418,
        borderColor: "#e6e6e6",
        marginLeft: -181.5,
        width: 363,
        borderRadius: 8,
        overflow: "hidden"
    },
    refund2: {
        left: 286,
        color: "#1235cf"
    }
});

export default MyTransactionsWithdrawls;
