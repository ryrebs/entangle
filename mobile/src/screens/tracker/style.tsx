import { Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  selfLocation: {
    zIndex: 99999,
  },
  icon: {
    width: 32,
    height: 32,
    margin: 2,
  },
  locationBtnWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    zIndex: 99999,
    marginLeft: 10,
  },
  targetMenuWrapper: {
    zIndex: 9999,
    position: "absolute",
    bottom: 0,
    right: 10,
  },
});

const mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#263c3f",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#6b9a76",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#38414e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#212a37",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9ca5b3",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#1f2835",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#f3d19c",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      {
        color: "#2f3948",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#515c6d",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
];

const targetStyle = StyleSheet.create({
  sub: {
    margin: 20,
  },
  input: {
    margin: 10,
  },
  scrollView: {
    width: Dimensions.get("window").width * 0.8,
    marginBottom: 5,
  },
  controlWrapper: {
    display: "flex",
    flexDirection: "row",
    height: 50,
    marginBottom: 15,
  },
  newTargetWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  cbDark: {
    backgroundColor: "#222B45",
    borderColor: "#222B45",
  },
  cbWhite: {
    backgroundColor: "#F7F9FC",
    borderColor: "#F7F9FC",
  },
  AddWrapper: {
    display: "flex",
    flexDirection: "row",
  },
  CheckBoxWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  activeIcon: {
    height: 20,
    width: 20,
  },
  addInput: {
    width: 200,
  },
});

export { mapStyle, styles, targetStyle };
