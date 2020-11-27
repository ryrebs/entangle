import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { ScrollView, Dimensions, View } from "react-native";
import {
  Layout,
  Text,
  Button,
  Icon,
  Modal,
  Card,
  Input,
} from "@ui-kitten/components";
import { targetsCoordsSelector } from "./store/reducer";
import { CheckBox } from "react-native-elements";
import { ThemeContext } from "../../context/ThemeContextProvider";
import * as eva from "@eva-design/eva";
import { isTimeGreaterThan5min } from "../../utils/date.util";
import { authSelector } from "../../store/auth/auth.reducer";
import { targetStyle as style } from "./style";

const MAX_TARGET = 20;

/** Icons */
const OnlineIcon = (lastUpdate: string) => {
  const activeColor = isTimeGreaterThan5min(lastUpdate) ? "#8F9BB3" : "#24650A";
  return <Icon style={style.activeIcon} fill={activeColor} name="activity" />;
};
const AddIcon = (props: any) => <Icon {...props} name="plus" />;
const TrackIcon = (props: any, newTarget: number) => {
  const activeColor = newTarget > 0 ? "#0D9FA9" : "#8F9BB3";
  return <Icon {...props} fill={activeColor} name="arrowhead-down" />;
};
const RemoveIcon = (props: any, deleteTarget: Array<string>) => {
  const activeColor = deleteTarget.length > 0 ? "#6D363F" : "#8F9BB3";
  return <Icon {...props} fill={activeColor} name="trash-2" />;
};
const MinusIcon = (props: any) => {
  return <Icon {...props} fill="#0D9FA9" name="minus" />;
};

/** Add new target modal */
const AddModal: any = React.memo(
  ({
    visible,
    setNumTargets,
    hideModalVisible,
    setNewTarget,
    newTargetList,
  }: any) => {
    const { id } = useSelector(authSelector);
    const [value, setValue] = React.useState("");
    const [error, setError] = React.useState("");
    const add = React.useCallback(() => {
      const matchRegex = /^\w+$/;
      if (value === id) {
        setError("Don't track yourself!");
      } else if (newTargetList.includes(value)) {
        setError("ID Exists!");
      } else if (matchRegex.test(value)) {
        setNewTarget((l: Array<string>) => [...l, ...[value]]);
        hideModalVisible();
        setNumTargets((l: number) => l - 1);
      } else {
        setError("Invalid ID");
      }
    }, [value, hideModalVisible, setNewTarget, newTargetList]);
    const onChangeTextReset = React.useCallback(
      (val: string) => {
        // TODO Fix warning: cannot update while rendering
        setError("");
        setValue(val);
      },
      [setValue, setError]
    );

    const label = "Track an ID: ";
    const labelWithError = error !== "" ? label + error : label;
    return (
      <Modal
        style={{
          padding: 24,
          flex: 1,
          justifyContent: "space-around",
          top: Dimensions.get("window").height * 0.2,
        }}
        visible={visible}
        backdropStyle={style.backdrop}
        onBackdropPress={hideModalVisible}
      >
        <Card disabled={true}>
          <Input
            label={labelWithError}
            style={style.addInput}
            status="basic"
            placeholder="ID"
            value={value}
            onChangeText={onChangeTextReset}
          />
          <Button onPress={add}>Add</Button>
        </Card>
      </Modal>
    );
  }
);

/** Track and untrack component  */
const TrackUntrackBTN = ({ newTargetList, deleteTarget, children }: any) => {
  const onTrackPress = () => {
    if (newTargetList.length > 0) {
      console.log(newTargetList);
    }
  };
  const onUntrackPress = () => {
    if (deleteTarget.length > 0) {
      console.log(deleteTarget);
    }
  };
  return children({
    onTrackPress,
    onUntrackPress,
  });
};

/** New target component */
const NewTargets = ({ newTargetList, onRemoveNewTarget }: any) => {
  return newTargetList.map((name: string, i: number) => (
    <View key={i + "v"} style={style.newTargetWrapper}>
      <Button
        key={i}
        appearance="ghost"
        status="basic"
        accessoryLeft={MinusIcon}
        onPress={() => onRemoveNewTarget(name)}
      >
        {name}
      </Button>
    </View>
  ));
};

/** Main component */
export default () => {
  const { theme } = React.useContext(ThemeContext);
  const [addVisible, setAddVisible] = React.useState<boolean>(false);
  const [checked, setChecked] = React.useState<Array<boolean>>([]);
  const targetCoords = useSelector(targetsCoordsSelector);
  const [numTargets, setNumTargets] = React.useState(
    MAX_TARGET - targetCoords.length
  );
  const [deleteTarget, setDeleteTargets] = React.useState<Array<string>>([]);
  const [newTargetList, setNewTargetList] = React.useState<Array<string>>([]);
  const [existingtTargets, setExistingTargets] = React.useState<Array<any>>([]);
  const cbTheme = theme === eva.dark ? style.cbDark : style.cbWhite;

  /** Callbacks */
  const onCheckUncheck = React.useCallback(
    (i: number, name: string) => {
      let newChecked = [];
      newChecked = [...checked]; // Create copy
      newChecked[i] = !checked[i]; // Flip the value
      setChecked(newChecked); // Update checked list
      // Add items to be deleted
      if (newChecked[i]) setDeleteTargets([...deleteTarget, ...[name]]);
      // Remove uncheck items
      else {
        setDeleteTargets((arr: Array<string>) => arr.filter((n) => n !== name));
      }
    },
    [deleteTarget, checked]
  );
  const onItemUncheckIcon = (props: any) => RemoveIcon(props, deleteTarget);
  const onRemoveNewTarget = (name: string) => {
    setNewTargetList((arr: Array<string>) => arr.filter((n) => n !== name));
    setNumTargets((i: number) => i + 1);
  };
  const showAddModalVisible = React.useCallback(() => setAddVisible(true), []);
  const hideModalVisible = React.useCallback(() => setAddVisible(false), []);

  /** Populate checked items with default values */
  useEffect(() => {
    let ch = [];
    for (let i = 0; i < numTargets; i++) {
      ch.push(false);
    }
    setChecked(ch);
  }, []);

  /** Create checkboxes of existing targets */
  React.useEffect(() => {
    const x = targetCoords.map((l: any, i: number) => {
      const val: boolean = checked[i];
      const cbTheme = theme === eva.dark ? style.cbDark : style.cbWhite;
      return (
        <View key={i + "v"} style={style.CheckBoxWrapper}>
          <CheckBox
            title={l.name}
            containerStyle={cbTheme}
            key={i}
            checkedIcon="dot-circle-o"
            uncheckedColor="#50515B"
            checkedColor="#6D363F"
            checked={val}
            onPress={() => onCheckUncheck(i, l.name)}
          />
          {OnlineIcon(l.lastUpdate)}
        </View>
      );
    });
    setExistingTargets(x);
  }, [targetCoords, onCheckUncheck, checked, theme]);

  return (
    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/** Upper control remaining no. and add btn */}
      <View style={style.AddWrapper}>
        <Text appearance="hint" style={style.sub}>
          Remaining: {numTargets}
        </Text>
        {numTargets > 0 ? (
          <Button
            appearance="ghost"
            onPress={showAddModalVisible}
            accessoryRight={AddIcon}
          />
        ) : null}
      </View>
      {/** Add modal */}
      <AddModal
        visible={addVisible}
        newTargetList={newTargetList}
        setNumTargets={setNumTargets}
        setNewTarget={setNewTargetList}
        hideModalVisible={hideModalVisible}
      />
      <ScrollView style={style.scrollView}>
        {/** New targets */}
        <NewTargets
          newTargetList={newTargetList}
          onRemoveNewTarget={onRemoveNewTarget}
        />
        {/** Existing targets */}
        {existingtTargets}
      </ScrollView>
      {/** Track and Untrack */}
      {/* TODO: Implement add and delete connection to api */}
      <View style={style.controlWrapper}>
        <TrackUntrackBTN
          newTargetList={newTargetList}
          deleteTarget={deleteTarget}
        >
          {({ onTrackPress, onUntrackPress }: any) => {
            return (
              <>
                <Button
                  onPress={onTrackPress}
                  appearance="ghost"
                  status="basic"
                  accessoryRight={(props: any) =>
                    TrackIcon(props, newTargetList.length)
                  }
                >
                  Track
                </Button>
                <Button
                  onPress={onUntrackPress}
                  appearance="ghost"
                  status="basic"
                  accessoryRight={onItemUncheckIcon}
                >
                  Untrack
                </Button>
              </>
            );
          }}
        </TrackUntrackBTN>
      </View>
    </Layout>
  );
};
