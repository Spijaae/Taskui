import orbitRing1 from "@/assets/orbit-ring-1.png";
import tile2 from "@/assets/tile-2.jpg";
import tile3 from "@/assets/tile-3.jpg";

const KB =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='420'%20height='300'%20viewBox='0%200%20420%20300'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cellipse%20id='Ellipse'%20cx='210'%20cy='150'%20rx='210'%20ry='150'%20fill='url(%23paint0_radial_0_209)'/%3e%3cdefs%3e%3cradialGradient%20id='paint0_radial_0_209'%20cx='0'%20cy='0'%20r='1'%20gradientUnits='userSpaceOnUse'%20gradientTransform='translate(210%20150)%20scale(210%20150)'%3e%3cstop%20stop-color='%234A90C4'%20stop-opacity='0.22'/%3e%3cstop%20offset='0.55'%20stop-color='%237FB3D4'%20stop-opacity='0.09'/%3e%3cstop%20offset='1'%20stop-color='%23C8E1F2'%20stop-opacity='0'/%3e%3c/radialGradient%3e%3c/defs%3e%3c/svg%3e";
const qB =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='176'%20height='68'%20viewBox='0%200%20176%2068'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cmask%20id='stroke0_0_205'%20fill='white'%3e%3cpath%20d='M176%2034C176%2052.7777%20136.601%2068%2088%2068C39.3989%2068%200%2052.7777%200%2034C0%2015.2223%2039.3989%200%2088%200C136.601%200%20176%2015.2223%20176%2034Z'/%3e%3c/mask%3e%3cpath%20id='Ellipse'%20d='M176%2034C176%2052.7777%20136.601%2068%2088%2068C39.3989%2068%200%2052.7777%200%2034C0%2015.2223%2039.3989%200%2088%200C136.601%200%20176%2015.2223%20176%2034Z'%20stroke-width='3'%20stroke='%23285E85'%20stroke-opacity='0.28'%20mask='url(%23stroke0_0_205)'/%3e%3c/svg%3e";
const YB =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='54'%20height='54'%20viewBox='0%200%2054%2054'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Ellipse'%20filter='url(%23filter0_d_0_204)'%3e%3ccircle%20cx='27'%20cy='24'%20r='19'%20fill='url(%23paint0_linear_0_204)'/%3e%3ccircle%20cx='27'%20cy='24'%20r='17.5'%20stroke='white'%20stroke-width='3'/%3e%3c/g%3e%3cdefs%3e%3cfilter%20id='filter0_d_0_204'%20x='0'%20y='0'%20width='54'%20height='54'%20filterUnits='userSpaceOnUse'%20color-interpolation-filters='sRGB'%3e%3cfeFlood%20flood-opacity='0'%20result='BackgroundImageFix'/%3e%3cfeColorMatrix%20in='SourceAlpha'%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%20127%200'%20result='hardAlpha'/%3e%3cfeOffset%20dy='3'/%3e%3cfeGaussianBlur%20stdDeviation='4'/%3e%3cfeColorMatrix%20type='matrix'%20values='0%200%200%200%200.16%200%200%200%200%200.37%200%200%200%200%200.52%200%200%200%200.18%200'/%3e%3cfeBlend%20mode='normal'%20in2='BackgroundImageFix'%20result='effect1_dropShadow_0_204'/%3e%3cfeBlend%20mode='normal'%20in='SourceGraphic'%20in2='effect1_dropShadow_0_204'%20result='shape'/%3e%3c/filter%3e%3clinearGradient%20id='paint0_linear_0_204'%20x1='8'%20y1='24'%20x2='46'%20y2='24'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='%23C8E1F2'/%3e%3cstop%20offset='1'%20stop-color='%23A8D0E8'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e";
const QB =
  "data:image/jpeg;base64,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";
const ZB =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCMRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAEigAwAEAAAAAQAAAIAAAAAA/+0AOFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/AABEIAIAASAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2wBDAAICAgICAgMCAgMFAwMDBQYFBQUFBggGBgYGBggKCAgICAgICgoKCgoKCgoMDAwMDAwODg4ODg8PDw8PDw8PDw//2wBDAQICAgQEBAcEBAcQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/3QAEAAX/2gAMAwEAAhEDEQA/AP3Dj+6v0q4o4qnGflX6VbQ5FAFpBUoGaYvSpRQAm2jbUm2lK4oArkVAy81ab1qMrQBTkHyn6VS2mtCQfKfpVPBoA//Q/b+FsoKtoaow/dX6VcSgC9G3arC9apA45qyrUAWgw6UE1GDQW9aAFPNRsKfUdAEUg4P0qltq/J90/SqVAH//0f28i4C/SriDvWVFKCq/StBHBFAFoHFTI1Vd3FOWSgDSHNLiq6SDpmpw3pQAvQU2nE8VGTg0ADfdP0qrzVhzlTj0qj81AH//0v2UtL5HRee1bMVxkAg186+GfiJouq20c9peRyxsAQVYEEV6lo+u2upEpayiQp1APIoA9DWfNTeZ3rGjZyoOKsrI2MGgDXjlq4kvoawRKasLI1AG6HBFRu+az1mOKeZu+aAJ3kIB57VU80+tQPM+D9Kqec3p+tAH/9P5A0zxvrnh9I4dFvZrWG5+cIrMNpbAKZzjhsivp74efHPxf4RvrTU4NReS4IVkViJY5EI+ZX5HUgjHB/EZr5C0lIdbs5TbyK7482NByVZuqEk8ZP41t2/iCCFIRLkS2qsFwCH6EjpgcZ9P60Af0G/Bj4zeG/i7YeVYyx2esW0Ya4s3ODx1eIn76fqvcd69zlt/KA80j2wc1/OL8PvirqngnxPZeJdEumiubRllUrysid0dc8qehHUV+t/gj41Xvi/R7TX9HuzcQ3Q+dD8xhkH3kf0I7e2D3oA+xVSMnGKmCKvQHFeJaR8TNUuIhIbbzo2BIdQQCQcHHHODXQf8LAaUxwW4RbiTkxucHauA2BwTj29KAPVI0TI3nA9O9NlEZY+XwvbNcD/wlDM6JIFUsuc7ht/P9KuHVbsLlU/Ig0AdNIQFPPaqPmD1rh7zxj5AeJhyB1x6+9Y3/Cap6/pQB//U/NFGntFFyshtgCcFCQmT6gd614taeTMd0I3diPmOVfnuPrXb/DXwRNqPjJPCXxAjl0PT7uIyGW6RlDE4KYIwDkn+Eg+nNfTfw0/Z58R+G9NfxZ4smhgu9PldLO1mKPDPDcIq7jKcAKM/ORyB0OcUAfFR1K1hPlzOYmRtoIz8p4/DH+c19AfCP4v+Pfh3cXd7pNs+rabLseeNonkhUqflZimCp6jrznpX1Ha/Cbwbo1hqMU+mHTIIYIf3N0qyW6LOxEyQtLvlMjdQQeRggjoMb4Q+BPAPhS81GEarNpuo3g2xQTyFLbdvbySC2VlLAZKliRyMUAdRoX7Wss13Npuq+H2sLct5TbXLvAGxu/duqkk/UV9m+BvHXwz8YaLFf6JqFxqksYaNo5R9l8vA+YFVJZs9Sd7DB5NfnTqng8eNr7TLcahDp1q087RNKMG7nQAlWuFUMNyAhMgAAAFcgmvb/BHx/uNE0S2t/Gvh6TT4rFobQPYQi5HmWokErXBiVcBsq24ZVgD6UAfZs3iVbZBFpqQWsYzgJGpIz7sSf1rl73xNqEw2S3jyL6bjj8BnFci3irR70t9rZdPZm2qk7Km5iAcLzgnkcDNVorm0vknexzJHbna8iDKKwOCCR0Ix3oA0ZtUnJYlzj8aqf2nL/fauW1nXNO0WybU9Vu47S1GB5kjhVO7pg98+2a4z/haPgP8A6D1r/wB/KAP/1fiTT/iLq/iXR7W08TafZ3yWt2FOoXZeNoImO4gLCVx8zDDhcKcepNfSXim/0wfCSHXdH1hdLtZ9T+z/AGnMl00oxvydw5/1YXBX7pPHJz418S/H+heFrjXfAuhQWuoWOsSx3bvCrRxLkBxEqqsY2oy8fIOpwRgVyHgp/iH4ntbe68Lxw6hpuiyy3EWlyzKsYkZSGaOGRvnIDHpk49sigD6S0Xxzf/EDU4Lny59Zn05BGRp3lxrgKgfKfIBuCg7W298DOa6O+07VvEPim00o2ttbaUyRjT+qwx3QGZo3imhXdMd5MYB5x8rHJqf4OeItQ8Ka3rnjj4jS6X4Eluoo7Ge3nsZIA/lHzUk2xEr5jltrM6g4wF68eh6vrfws+IdvZ+LbfxVZfadPs1l1HTiIxZyRjDPxEElWYYLKApY85HagDwvwr4L8YeCfEKX08/8AwkOmrcxJNvZ18osrCWRlUMGEZfkEqQvQda6zT/ipoWkWdxoVrqlvFomrRXkbae0bW+y4mQRiOLZkqTG7bGkIDdFbnFWjp3go6leeAtM1C31nULVobyXyJ2iFtESjlIpH8tiPnCsAflIGcdRr+IPC2t65dyr4S8QRXtzcS+VHDcTxG7kghOc3EJBLupJCgA4GCCcmgDkfGfhXwVrngbTtX8O+K7+zfTPM+z2N1sknSOZQjhJC5bedoK5HQZG016VpXji40vxPPZW7XuoaRYWUTwSamiRwfvAVuCIVZFD/ADAR7SSX4xk15FpKeJvGN7/wjWl20em3tldeTHPp7m2QTN1cxbgC7BcN9wA/eAIIrqfH3wr0jUbu4v31eTRNZmWO0vbNrkXE0oDqSwIyUbgBj33DAIoA8yvL/wAG6vqvl6Tq97bXGoM8CpLIdtrHG24ynzGJCORzhiOuMcGrn/CG2f8A0PMH/f8AH/xVaHh7wB8P/D9zdvYyG9ubhhZ/atTSRRZSufLRJcxRIUc9WY5ChjjjNdf/AMK3P/QY8If9/ov/AIqgD//W+Z4tZ1n4rx/8IHceF9FF6iANqKWyWd1IExkNcPn5sfL6mvUfD/gjVPCdukfh2zi0OOwieC5k1CGHynkQlw5lO9yRy2cHOMYxxXs3ws0S1t/h7Nq2r+BfEB169UQrpNrpNxCImjJKyteXAdmUkhsDHA2kNjnG8Y+GPE+k+HZjq+k3ug3ets0fmXRMYRSoLF+CsgKjazsBtBAUL3APKvGN5qun+AtRt9dbw62mai2LHUNLmbc04iYIkixpGW45y64UZAGSa4D4a+FfDeveE9LtNa8Uv4X1XSZLht6Q+at2txlgpePByRgDcxyDtwMV7prfwr/4TDwlaN8HZDff2Tta8srmWRGmnJAlkQyfKrOEwcNzj6V88aQ0Xh7UpNM+L2hatpkyFvsiRRbEeVZAVRlwg6HCygkDrg0Ad18LfBHhvTvFFtr+japaajJfK8jQ6lMUaKCIFisgg3SRy5UHaxxx14Brc8ReLdT8QeMtO1W2huGsIri6n0+/zP5sX2hdjbiQ4CIwPAOenGer/wDhbngvTdS0Gx8AxxeHbGG4lE8mpyC+jM07b5C7yRlA2QW3BZAML0yRXc+L/wBo/XdFtr3TNHk0i1ms4iIWsgszNLInJSSB/KjBDBh8gHGeDwACHQbqbxBqdz4ssrybVL6CJZbu2tbOL7JJOSI2iDOjIzFOjRpkHuTzUnirSdW1L7JqaWF5pV29xLsubuGGzhAZ1gkjSSLdk7B0YKeMgk818van8RfiX42K2WkyagkNsxd3lupJAJXQBvnAVcBRhRjcAcdM5vaR4o+IuualNpfiS9vb60tLAXSRm4eWPYgQIYwu5CADtwMYzjIoA9psdKsNM8W3ehfE/TYJLq5gfyFij+2srxnCqwt5Q2yNRkN5Z3c5B610n/CLfDT/AKB0X/gnu/8A4is/w/8ADrxj4Xvrf4n6P4XvIvD17YmV9Se6S5ktrV8OsixI6sdq53ITluldX/wtDS/+hu1H/wAFEn/x+gD/2Q==";
const FRAME_W = 390;
const FRAME_H = 250;
const FRAME_TOP = 100;
const pctX = (e) => `${(e / FRAME_W) * 100}%`;
const pctY = (e) => `${((e - FRAME_TOP) / FRAME_H) * 100}%`;
const MOBILE_PHOTOS = [
  {
    src: QB,
    left: 245.21,
    top: 241,
    size: 52,
    r: 11,
    o: 0.91,
    a: 0.14,
  },
  {
    src: tile2,
    left: 98.79,
    top: 213,
    size: 40,
    r: 9,
    o: 0.74,
    a: 0.09,
  },
  {
    src: tile3,
    left: 95,
    top: 273.5,
    size: 50,
    r: 11,
    o: 0.98,
    a: 0.15,
  },
  {
    src: ZB,
    left: 306.9,
    top: 204,
    size: 36,
    r: 8,
    o: 0.74,
    a: 0.09,
  },
];
export function MobileSkyGradient() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-gradient-to-b from-[#c8e1f2] to-[rgba(246,249,252,0)] lg:hidden"
    />
  );
}
export function MobileOrbit() {
  return (
    <div
      aria-hidden
      className="pointer-events-none relative mx-auto w-full max-w-[390px] shrink-0 lg:hidden"
      style={{
        aspectRatio: `${FRAME_W} / ${FRAME_H}`,
      }}
    >
      <img
        src={KB}
        alt=""
        className="absolute"
        style={{
          left: pctX(-15),
          top: pctY(100),
          width: pctX(420),
        }}
      />
      <img
        src={orbitRing1}
        alt=""
        className="absolute"
        style={{
          left: pctX(45),
          top: pctY(194),
          width: pctX(300),
        }}
      />
      <img
        src={qB}
        alt=""
        className="absolute"
        style={{
          left: pctX(107),
          top: pctY(216),
          width: pctX(176),
        }}
      />
      {MOBILE_PHOTOS.map((e) => (
        <div
          key={e.src}
          className="absolute overflow-hidden border-[3px] border-alma-surface bg-alma-surface"
          style={{
            left: pctX(e.left),
            top: pctY(e.top),
            width: pctX(e.size),
            aspectRatio: "1 / 1",
            borderRadius: e.r,
            opacity: e.o,
            boxShadow: `0px 4px 14px 0px rgba(41,94,133,${e.a})`,
          }}
        >
          <img src={e.src} alt="" className="size-full object-cover" />
        </div>
      ))}
      <img
        src={YB}
        alt=""
        className="absolute"
        style={{
          left: pctX(176),
          top: pctY(231),
          width: pctX(38),
        }}
      />
    </div>
  );
}
