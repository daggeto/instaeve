import Service from "./Service";

export interface Params {
  page: any;
  requestCondition: Function;
  responseCondition: Function;
  process: Function;
}

export default class GraphQLInterceptor extends Service {
  async call({ page, requestCondition, responseCondition, process }: Params) {
    await page.setRequestInterception(true);
    page.on("request", async request => {
      if (!requestCondition(request)) {
        return request.continue();
      }

      page
        .waitForResponse(
          async response => {
            const conditionResult = await responseCondition(response);

            if (!conditionResult) {
              return false;
            }

            process(response);
            return true;
          },
          { timeout: 60000 }
        )
        .catch(error => {
          throw error;
        });
      request.continue();
    });
  }
}
