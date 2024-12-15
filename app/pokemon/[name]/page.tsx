"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PokemonEnum, useGetPokemonQuery } from "../../gql/graphql";

const Page = () => {
  const params = useParams();
  const name = String(params["name"]);
  const [result] = useGetPokemonQuery({
    variables: { pokemon: name as PokemonEnum },
  });

  const data = result.data?.getPokemon;

  if (!data || result.fetching) return <div>loading</div>;
  return (
    <>
      <title>{name}</title>
      <div style={{ padding: "8px" }}>
        <Link
          href="/1"
          style={{
            textDecoration: "none",
            padding: "8px 32px",
            boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        >
          ⏪️List
        </Link>
      </div>
      <hr style={{ margin: "24px 0" }} />
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "8px",
        }}
      >
        <img
          style={{ boxShadow: "0 0 8px rgba(0, 0, 0, 0.5)" }}
          src={data.sprite}
        />
        <div>{name}</div>
      </div>
    </>
  );
};
export default Page;
