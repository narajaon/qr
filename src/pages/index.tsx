import React from 'react';
import Head from 'next/head';
import jsQR from 'jsqr';
import fetch from 'node-fetch';
import { PNG } from 'pngjs';
import jpeg from 'jpeg-js';
import { GetServerSideProps } from 'next';
import FileType from 'file-type';

export default function Home({ data }: { data: string | null }) {
  return (
    <div>
      <Head>
        <title>ez | Home page</title>
        <meta name="description" content="ez | Home page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>{data}</div>
    </div>
  );
}

const parsePNG = async (buffer: Buffer): Promise<ImageData | null> => {
  const png = new PNG();
  const data = await new Promise<Uint8ClampedArray | null>(
    (resolve, reject) => {
      png.parse(buffer, (err, res) => {
        if (err) {
          reject(null);
        } else {
          resolve(new Uint8ClampedArray(res.data));
        }
      });
    }
  );

  return data
    ? {
        data,
        width: png.width,
        height: png.height,
      }
    : null;
};

const parseJPEG = async (buffer: Buffer): Promise<ImageData | null> => {
  const jpg = jpeg.decode(buffer);
  const data = new Uint8ClampedArray(jpg.data);

  return Promise.resolve(
    data
      ? {
          data,
          width: jpg.width,
          height: jpg.height,
        }
      : null
  );
};

const parseImage = async (buffer: Buffer): Promise<ImageData | null> => {
  const { mime } = (await FileType.fromBuffer(buffer)) || {};

  switch (mime) {
    case 'image/png':
      return parsePNG(buffer);
    case 'image/jpeg':
      return parseJPEG(buffer);
    default:
      return null;
  }
};

export const getServerSideProps: GetServerSideProps<{ data: string | null }> =
  async ({ query }) => {
    const res = await fetch(
      (query.url as string) || 'http://localhost:3000/real.jpg'
    );
    const buffer = await res.buffer();
    const { data, width, height } = (await parseImage(buffer)) || {};

    if (!data || !width || !height) return { props: { data: null } };

    const qr = jsQR(data, width, height);
    console.log(qr?.data);

    return {
      props: { data: qr?.data || null },
    };
  };
