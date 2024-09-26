import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";

function FieldArraySample() {
  const TrialComponent = () => {
    const [productSelectList, setProductSelectList] = useState();
    const [amount, setAmount] = useState();

    useEffect(() => {
      async function getProductsList() {
        const productsList = await fetch("http://localhost:4001");
        const data = await productsList.json();
        const { rows } = data;
        // product item list for selection
        const selectItems = rows.map((e, idx) => (
          <option key={idx} value={e.product_name}>
            {e.product_name}
          </option>
        ));
        setProductSelectList(selectItems);
        // product amount list
        const productAmount = rows.map((e) => {
          let returnData = {
            [e.product_name]: e.product_unit_cost,
          };
          return returnData;
        });
        let object = {};
        for (let i = 0; i < productAmount.length; i++) {
          object[Object.keys(productAmount[i])] = Object.values(
            productAmount[i]
          )[0];
        }
        setAmount(object);
      }
      getProductsList();
    }, []);
    if (amount) {
      console.log(amount);
    }
    const FormComponent = () => {
      const initialValues = {
        listItems: [{
          itemName :"",
          itemAmount: 0,
          itemQuantity: 0
        }],
      };
      return (
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { resetForm }) => {
            console.log(values);
            resetForm();
          }}
        >
          {(formikProps) => (
            <Form>
              <label>List of Line items</label>
              <FieldArray name="listItems">
                {(fieldArrayProps) => {
                  const { form, push, remove } = fieldArrayProps;
                  const { listItems } = form.values;
                  return (
                    <div>
                      {listItems.map((listItem, index) => {
                        return (
                          <div key={index}>
                            <label htmlFor="listItems.itemName">
                              enter the name of the item
                            </label>
                            <Field
                              as="select"
                              name={`listItems[${index}.itemName]`}
                            >
                              <option value={""}>Select an option</option>
                              {productSelectList}
                            </Field>
                            <label>enter quantity</label>
                            <Field
                              name={`listItems[${index}].itemQuantity`}
                              type="number"
                            />
                            <label>Item Amount</label>
                            <Field name={`listItems[${index}].itemAmount`}>
                              {(fieldProps) => {
                                const { field, form } = fieldProps;

                                if (
                                  amount &&
                                  form.values.listItems[index].itemQuantity &&
                                  form.values.listItems[index].itemName
                                ) {
                                  field.value =
                                    form.values.listItems[index].itemQuantity *
                                    amount[
                                      form.values.listItems[index].itemName
                                    ];
                                  form.values.listItems[index].itemAmount =
                                    field.value;
                                }
                                return <input type="number" {...field} />;
                              }}
                            </Field>

                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                              >
                                -
                              </button>
                            )}

                            <button type="button" onClick={(e) => push("")}>
                              +
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  );
                }}
              </FieldArray>
              <button type="submit">submit</button>
            </Form>
          )}
        </Formik>
      );
    };
    return <FormComponent />;
  };

  return (
    <div>
      <TrialComponent />
    </div>
  );
}

export default FieldArraySample;
