/**
 * User-defined function (UDF) to transform CSV lines to JSON.
 * This function parses the comma-separated values and maps them
 * to the BigQuery schema fields.
 *
 * @param {string} line - A single line of text from the CSV file.
 * @return {?string} - A stringified JSON object or null to drop the row.
 */
function process(line) {
  // 1. Split the CSV line by comma
  // specific to the data format: id,first_name,last_name,email,department,joining_date,salary,location
  var values = line.split(',');

  // 2. Filter out the Header Row or Empty Lines
  // If the first value is "id" (the header) or line is empty, return null to skip this record.
  if (!line || values[0] === 'id' || values.length < 8) {
    return null;
  }

  // 3. Map values to your BigQuery Schema
  // We use parseInt for 'id' and 'salary' to match the INTEGER schema type.
  var obj = {
    id: parseInt(values[0]),
    first_name: values[1],
    last_name: values[2],
    email: values[3],
    department: values[4],
    joining_date: values[5], // Keep as string "YYYY-MM-DD", BigQuery handles the conversion to DATE
    salary: parseInt(values[6]),
    location: values[7]
    // Optional: You could add a transformation here, e.g.:
    // region: values[7] === 'New York' ? 'US-East' : 'International'
  };

  // 4. Return the stringified JSON object
  return JSON.stringify(obj);
}
