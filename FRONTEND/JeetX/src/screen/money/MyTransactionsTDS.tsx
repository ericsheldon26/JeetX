import * as React from "react";
import { ScrollView, StyleSheet, Text, View, Image as RNImage, Pressable } from "react-native";

const Image = (props: any) => <View {...props} style={[{ backgroundColor: 'rgba(255,255,255,0.1)' }, props.style]} ><RNImage {...props} style={{ display: 'none' }} /></View>;
import LinearGradient from "react-native-linear-gradient";
// import { SafeAreaView } from "react-native-safe-area-context"; // Original Windows/Native code
import ScreenWrapper from "../../components/ScreenWrapper"; // Linux/NewArch Fix


const MyTransactionsTDS = () => {

    return (

        <ScreenWrapper 
          style={[styles.myTransactionstds, styles.viewFlexBox]}
          statusBarColor="#010e0f"
          statusBarStyle="light-content"
          backgroundColor="#f4f6f6"
        >
            {/* <SafeAreaView style={[styles.myTransactionstds, styles.viewFlexBox]}> */} {/* Original code */}

            <View style={[styles.view, styles.viewLayout]}>
                <LinearGradient style={[styles.bg, styles.bgLayout]} locations={[0, 1]} colors={['#02121a', '#0d3648']} useAngle={true} angle={-90}>
                    <ScrollView style={styles.bgLayout} horizontal={true}>
                        <Image style={[styles.bgChild, styles.childLayout]} resizeMode="cover" />
                        <Image style={[styles.bgItem, styles.bgItemPosition]} resizeMode="cover" />
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
                                <View style={styles.parentFlexBox1}>
                                    <Image style={[styles.appsUndefinedGlyphUnde, styles.arrowLayout]} resizeMode="cover" />
                                    <Text style={[styles.contests, styles.tdsTypo1]}>Contests</Text>
                                </View>
                            </View>
                            <Pressable style={styles.frameWrapper} onPress={() => { }}>
                                <View style={[styles.appsUndefinedGlyphUndeGroup, styles.parentFlexBox1]}>
                                    <Image style={[styles.appsUndefinedGlyphUnde, styles.arrowLayout]} resizeMode="cover" />
                                    <Image style={[styles.appsUndefinedGlyphUnde, styles.arrowLayout]} resizeMode="cover" />
                                    <Image style={[styles.appsUndefinedGlyphUnde, styles.arrowLayout]} resizeMode="cover" />
                                    <Image style={[styles.appsUndefinedGlyphUnde, styles.arrowLayout]} resizeMode="cover" />
                                    <Text style={[styles.contests, styles.tdsTypo1]}>Withdrawals</Text>
                                </View>
                            </Pressable>
                            <View style={styles.frameWrapper}>
                                <View style={[styles.appsUndefinedGlyphUndeGroup, styles.parentFlexBox1]}>
                                    <Image style={[styles.appsUndefinedGlyphUnde, styles.arrowLayout]} resizeMode="cover" />
                                    <Image style={[styles.appsUndefinedGlyphUnde, styles.arrowLayout]} resizeMode="cover" />
                                    <Text style={[styles.contests, styles.tdsTypo1]}>Deposits</Text>
                                </View>
                            </View>
                            <View style={styles.frameWrapper}>
                                <View style={[styles.appsUndefinedGlyphUndeGroup, styles.parentFlexBox1]}>
                                    <Image style={[styles.appsUndefinedGlyphUnde, styles.arrowLayout]} resizeMode="cover" />
                                    <Image style={[styles.appsUndefinedGlyphUnde, styles.arrowLayout]} resizeMode="cover" />
                                    <Image style={[styles.appsUndefinedGlyphUnde, styles.arrowLayout]} resizeMode="cover" />
                                    <Text style={[styles.tds, styles.tdsTypo1]}>TDS</Text>
                                </View>
                            </View>
                        </ScrollView>
                        <View style={[styles.categoriesChild, styles.batteryEndIconLayout]} />
                    </View>
                    <Text style={styles.transactionsMayTake}>Transactions may take 15min to reflect here.</Text>
                    <View style={[styles.st, styles.stLayout]}>
                        <View style={[styles.stChild, styles.stLayout]} />
                        <View style={[styles.groupParent, styles.groupLayout]}>
                            <Image style={[styles.groupChild, styles.groupLayout]} resizeMode="cover" />
                            <Text style={[styles.rd, styles.rdPosition]}>3rd</Text>
                            <Image style={styles.maskGroupIcon} resizeMode="cover" />
                        </View>
                        <Text style={[styles.tdsAmountDeduction, styles.tdsTypo]}>TDS Amount Deduction</Text>
                        <Text style={[styles.july2025545, styles.typeTypo]}>25 July 2025, 5:45 PM</Text>
                        <View style={[styles.typeParent, styles.parentFlexBox1]}>
                            <Text style={[styles.type, styles.typeTypo]}>Type:</Text>
                            <Text style={[styles.tdsAmountDeduction2, styles.typeTypo]}>TDS Amount Deduction</Text>
                        </View>
                        <View style={[styles.descriptionParent, styles.parentFlexBox]}>
                            <Text style={[styles.type, styles.typeTypo]}>Description:</Text>
                            <Text style={[styles.deductedOnWinnings, styles.typeTypo]}>Deducted on winnings over Rs 10,000</Text>
                        </View>
                        <Text style={[styles.text, styles.textTypo]}>-  ₹ 250</Text>
                        <Text style={[styles.deduction, styles.tdsTypo1]}>Deduction</Text>
                        <View style={[styles.rectangleParent, styles.groupItemLayout]}>
                            <View style={[styles.groupItem, styles.groupItemLayout]} />
                            <Image style={[styles.arrowUpRightUndefinedG, styles.rdPosition]} resizeMode="cover" />
                        </View>
                        <Image style={styles.stItem} resizeMode="cover" />
                    </View>
                    <View style={[styles.st2, styles.stLayout]}>
                        <View style={[styles.stChild, styles.stLayout]} />
                        <View style={[styles.groupParent, styles.groupLayout]}>
                            <Image style={[styles.groupChild, styles.groupLayout]} resizeMode="cover" />
                            <Text style={[styles.rd, styles.rdPosition]}>3rd</Text>
                            <Image style={styles.maskGroupIcon} resizeMode="cover" />
                        </View>
                        <Text style={[styles.tdsAmountDeduction, styles.tdsTypo]}>TDS Amount Deduction</Text>
                        <Text style={[styles.july2025545, styles.typeTypo]}>25 July 2025, 5:45 PM</Text>
                        <View style={[styles.typeParent, styles.parentFlexBox1]}>
                            <Text style={[styles.type, styles.typeTypo]}>Type:</Text>
                            <Text style={[styles.tdsAmountDeduction2, styles.typeTypo]}>TDS Amount Deduction</Text>
                        </View>
                        <View style={[styles.descriptionParent, styles.parentFlexBox]}>
                            <Text style={[styles.type, styles.typeTypo]}>Description:</Text>
                            <Text style={[styles.deductedOnWinnings, styles.typeTypo]}>Deducted on winnings over Rs 10,000</Text>
                        </View>
                        <Text style={[styles.text, styles.textTypo]}>-  ₹ 100</Text>
                        <Text style={[styles.deduction, styles.tdsTypo1]}>Deduction</Text>
                        <View style={[styles.rectangleParent, styles.groupItemLayout]}>
                            <View style={[styles.groupItem, styles.groupItemLayout]} />
                            <Image style={[styles.arrowUpRightUndefinedG, styles.rdPosition]} resizeMode="cover" />
                        </View>
                        <Image style={styles.stItem} resizeMode="cover" />
                    </View>
                    <View style={[styles.st3, styles.stLayout]}>
                        <View style={[styles.stChild, styles.stLayout]} />
                        <View style={[styles.groupParent, styles.groupLayout]}>
                            <Image style={[styles.groupChild, styles.groupLayout]} resizeMode="cover" />
                            <Text style={[styles.rd, styles.rdPosition]}>3rd</Text>
                            <Image style={styles.maskGroupIcon} resizeMode="cover" />
                        </View>
                        <Text style={[styles.tdsAmountDeduction, styles.tdsTypo]}>TDS Amount Deduction</Text>
                        <Text style={[styles.july2025545, styles.typeTypo]}>25 July 2025, 5:45 PM</Text>
                        <View style={[styles.typeParent, styles.parentFlexBox1]}>
                            <Text style={[styles.type, styles.typeTypo]}>Type:</Text>
                            <Text style={[styles.tdsAmountDeduction2, styles.typeTypo]}>TDS Amount Deduction</Text>
                        </View>
                        <View style={[styles.descriptionParent, styles.parentFlexBox]}>
                            <Text style={[styles.type, styles.typeTypo]}>Description:</Text>
                            <Text style={[styles.deductedOnWinnings, styles.typeTypo]}>Deducted on winnings over Rs 10,000</Text>
                        </View>
                        <Text style={[styles.text, styles.textTypo]}>-  ₹ 150</Text>
                        <Text style={[styles.deduction, styles.tdsTypo1]}>Deduction</Text>
                        <View style={[styles.rectangleParent, styles.groupItemLayout]}>
                            <View style={[styles.groupItem, styles.groupItemLayout]} />
                            <Image style={[styles.arrowUpRightUndefinedG, styles.rdPosition]} resizeMode="cover" />
                        </View>
                        <Image style={styles.stItem} resizeMode="cover" />
                    </View>
                    <View style={[styles.st4, styles.stLayout]}>
                        <View style={[styles.stChild, styles.stLayout]} />
                        <View style={[styles.groupParent, styles.groupLayout]}>
                            <Image style={[styles.groupChild, styles.groupLayout]} resizeMode="cover" />
                            <Text style={[styles.rd, styles.rdPosition]}>3rd</Text>
                            <Image style={styles.maskGroupIcon} resizeMode="cover" />
                        </View>
                        <Text style={[styles.tdsAmountDeduction, styles.tdsTypo]}>TDS Amount Deduction</Text>
                        <Text style={[styles.july2025545, styles.typeTypo]}>25 July 2025, 5:45 PM</Text>
                        <View style={[styles.typeParent, styles.parentFlexBox1]}>
                            <Text style={[styles.type, styles.typeTypo]}>Type:</Text>
                            <Text style={[styles.tdsAmountDeduction2, styles.typeTypo]}>TDS Amount Deduction</Text>
                        </View>
                        <View style={[styles.descriptionParent, styles.parentFlexBox]}>
                            <Text style={[styles.type, styles.typeTypo]}>Description:</Text>
                            <Text style={[styles.deductedOnWinnings, styles.typeTypo]}>Deducted on winnings over Rs 10,000</Text>
                        </View>
                        <Text style={[styles.text, styles.textTypo]}>-  ₹ 500</Text>
                        <Text style={[styles.deduction, styles.tdsTypo1]}>Deduction</Text>
                        <View style={[styles.rectangleParent, styles.groupItemLayout]}>
                            <View style={[styles.groupItem, styles.groupItemLayout]} />
                            <Image style={[styles.arrowUpRightUndefinedG, styles.rdPosition]} resizeMode="cover" />
                        </View>
                        <Image style={styles.stItem} resizeMode="cover" />
                    </View>
                </View>
                <View style={[styles.addCashParent, styles.parentFlexBox]}>
                    <View style={styles.addCash}>
                        <Text style={[styles.tdsAmountDeduction9, styles.tdsTypo]}>TDS Amount Deduction</Text>
                    </View>
                    <View style={styles.addCash}>
                        <Text style={[styles.tdsAmountDeduction9, styles.tdsTypo]}>Year-End TDS Deduction</Text>
                    </View>
                    <View style={styles.addCash}>
                        <Text style={[styles.tdsAmountDeduction9, styles.tdsTypo]}>TDS Deduction for Salary Payments</Text>
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
    myTransactionstds: {
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
        top: 1
    },
    bgItemPosition: {
        left: 265,
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
    tdsTypo1: {
        lineHeight: 20,
        fontSize: 16,
        textAlign: "left"
    },
    parentFlexBox1: {
        gap: 6,
        alignItems: "center",
        flexDirection: "row"
    },
    stLayout: {
        height: 157,
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
    tdsTypo: {
        fontSize: 15,
        color: "#272f2f",
        lineHeight: 20,
        textAlign: "left"
    },
    typeTypo: {
        lineHeight: 18,
        fontSize: 14,
        textAlign: "left"
    },
    parentFlexBox: {
        gap: 8,
        flexDirection: "row",
        position: "absolute"
    },
    textTypo: {
        fontFamily: "OpenSans-Bold",
        lineHeight: 24,
        fontSize: 20,
        fontWeight: "700",
        position: "absolute"
    },
    groupItemLayout: {
        height: 36,
        width: 36,
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
        left: 128,
        position: "absolute"
    },
    bgItem: {
        height: 58,
        width: 28,
        top: 1
    },
    bgInner: {
        left: 38,
        position: "absolute"
    },
    groupIcon: {
        left: 156,
        position: "absolute"
    },
    bgChild2: {
        left: 294,
        position: "absolute"
    },
    bgChild3: {
        left: 66,
        position: "absolute"
    },
    bgChild4: {
        left: 185,
        position: "absolute"
    },
    bgChild5: {
        left: 322,
        position: "absolute"
    },
    bgChild6: {
        left: 95,
        position: "absolute"
    },
    bgChild7: {
        left: 213,
        position: "absolute"
    },
    bgChild8: {
        left: 351,
        position: "absolute"
    },
    bgChild9: {
        left: 123,
        position: "absolute"
    },
    bgChild10: {
        left: 242,
        position: "absolute"
    },
    bgChild11: {
        left: 379,
        position: "absolute"
    },
    bgChild12: {
        left: 152,
        position: "absolute"
    },
    bgChild13: {
        left: 270,
        position: "absolute"
    },
    bgChild14: {
        left: 407,
        position: "absolute"
    },
    bgChild15: {
        left: 180,
        position: "absolute"
    },
    bgChild16: {
        left: -2,
        position: "absolute"
    },
    bgChild17: {
        left: 10,
        position: "absolute"
    },
    bgChild18: {
        left: 364,
        position: "absolute"
    },
    myTransactions: {
        marginLeft: -81.5,
        textAlign: "left",
        fontFamily: "OpenSans-Bold",
        lineHeight: 24,
        fontSize: 20,
        fontWeight: "700",
        position: "absolute",
        left: "50%",
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
        fontFamily: "OpenSans-Regular"
    },
    appsUndefinedGlyphUndeGroup: {
        alignSelf: "stretch"
    },
    tds: {
        fontFamily: "Montserrat-Bold",
        color: "#008d9d",
        fontWeight: "700",
        lineHeight: 20
    },
    categoriesChild: {
        top: 39,
        left: 311,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        backgroundColor: "#008d9d",
        width: 46
    },
    transactionsMayTake: {
        top: 102,
        color: "#272f2f",
        fontSize: 14,
        left: 16,
        fontFamily: "OpenSans-Regular",
        lineHeight: 20,
        textAlign: "left",
        position: "absolute"
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
    tdsAmountDeduction: {
        fontFamily: "OpenSans-SemiBold",
        left: 58,
        position: "absolute",
        fontWeight: "600",
        top: 14
    },
    july2025545: {
        top: 36,
        left: 58,
        position: "absolute",
        color: "#272f2f",
        fontFamily: "OpenSans-Regular"
    },
    typeParent: {
        top: 79,
        left: 10,
        position: "absolute"
    },
    type: {
        fontFamily: "Roboto-Regular",
        color: "#728181"
    },
    tdsAmountDeduction2: {
        color: "#272f2f",
        fontFamily: "OpenSans-Regular"
    },
    descriptionParent: {
        top: 105,
        left: 10
    },
    deductedOnWinnings: {
        width: 235,
        color: "#272f2f",
        fontFamily: "OpenSans-Regular"
    },
    text: {
        top: 22,
        left: 277,
        letterSpacing: -1,
        color: "#272f2f",
        textAlign: "left"
    },
    deduction: {
        top: 15,
        fontFamily: "Roboto-Bold",
        color: "#dd2727",
        display: "none",
        fontWeight: "600",
        left: 265,
        position: "absolute"
    },
    rectangleParent: {
        top: 16,
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
    stItem: {
        top: 69,
        left: 11,
        maxHeight: "100%",
        width: 329,
        position: "absolute"
    },
    st2: {
        top: 469,
        borderColor: "#e6e6e6",
        marginLeft: -181.5,
        width: 363,
        borderRadius: 8,
        overflow: "hidden"
    },
    st3: {
        top: 304,
        borderColor: "#e6e6e6",
        marginLeft: -181.5,
        width: 363,
        borderRadius: 8,
        overflow: "hidden"
    },
    st4: {
        top: 634,
        borderColor: "#e6e6e6",
        marginLeft: -181.5,
        width: 363,
        borderRadius: 8,
        overflow: "hidden"
    },
    addCashParent: {
        top: 149,
        left: 16,
        gap: 8
    },
    addCash: {
        borderRadius: 22,
        borderColor: "#e3e3e3",
        justifyContent: "center",
        paddingHorizontal: 16,
        borderWidth: 1,
        alignItems: "center",
        flexDirection: "row",
        paddingVertical: 8,
        borderStyle: "solid",
        backgroundColor: "#fff"
    },
    tdsAmountDeduction9: {
        fontWeight: "500",
        fontFamily: "Montserrat-Medium"
    }
});

export default MyTransactionsTDS;
