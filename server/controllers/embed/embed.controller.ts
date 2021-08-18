import {
  fetchOembedData,
  unknownProvider
} from '../../services/postgres/embed.service';


export const getOmbed = async(url: string) =>
  fetchOembedData(url)
    .then((response) => {
      const data = response || unknownProvider();
      return data;
    })
    .catch(() => unknownProvider());
