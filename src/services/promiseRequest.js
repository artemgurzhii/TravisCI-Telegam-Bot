import https from 'https';

export default function getContent(url) {

  // return new pending promise
  return new Promise((resolve, reject) => {

    // creating request
    const request = https.get(url, response => {

      // handle https errors
      if (response.statusCode < 200 || response.statusCode > 299) {
         reject(new Error(`Failed to load page, status code: ${response.statusCode}`));
       }

      // temporary data holder
      let body = [];

      // on every content chunk, push it to the data array
      response.on('data', chunk => body.push(chunk));

      // we are done, resolve promise with those joined chunks
      response.on('end', () => resolve(body.join('')));
    });

    // handle connection errors of the request
    request.on('error', err => reject(err));
  });
}
