const colors = [
  "F94144",
  "F3722C",
  "F8961E",
  "F9844A",
  "F9C74F",
  "90BE6D",
  "43AA8B",
  "4D908E",
  "577590",
  "277DA1",
  "D7263D",
  "8CB369",
  "F4E285",
  "F4A259",
  "5B8E7D",
  "BC4B51",
];

const assignments = new Map();

export default function getColor(key) {
  let result = assignments.get(key);
  if (!result) {
    result = colors.pop();
    assignments.set(key, result);
  }
  return result + "BF";
}
