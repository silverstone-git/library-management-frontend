import { AuthContextSchema } from "../schemas/schemas";

export const fetchTransactions = async (auth: AuthContextSchema, setTransactions: any) => {

  console.log("sending request to transactions endpoint GET...");
  let response;
  if(auth.authLevel < 2) {
    // get user's onlu
    response = await fetch(import.meta.env.VITE_API_URL + '/api/v1/transactions/user/' + auth.user._id, {
      headers: {
        'Authorization': `Bearer ${auth.token}`
      }
    });
  } else {

    // get all, because its admin
    response = await fetch(import.meta.env.VITE_API_URL + '/api/v1/transactions', {
      headers: {
        'Authorization': `Bearer ${auth.token}`
      }
    });

  }

  const { data } = await response.json();

  console.log("returned data", data);

  if(response.ok) {
    setTransactions(data);
    return data;
  } else {
    return [];
  }
}
