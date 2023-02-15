import axios from "axios";


async function fetchImges(inputData, incrementPage) { 
  try {
    const BASE_URL = 'https://pixabay.com/api/'
    const KEY = 'key=33623855-66444e6c0c2d207b8933f84d3'
    const data = await axios.get(`${BASE_URL}?${KEY}&q=${inputData}&image_type=photo&orientation=horizontal&safesearch=true&page=${incrementPage}&per_page=40`);
    
    return data.data;
  }
  catch (error) {
    console.error(error);
  };
};

export { fetchImges };