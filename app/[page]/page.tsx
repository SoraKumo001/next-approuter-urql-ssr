"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetAllPokemonQuery } from "../gql/graphql";

const Page = () => {
  const params = useParams();
  const page = Number(params["page"] ?? 1);
  const [result] = useGetAllPokemonQuery({
    variables: { take: 10, offset: (page - 1) * 10, takeFlavorTexts: 1 },
  });

  const data = result.data?.getAllPokemon;

  if (!data || result.fetching) return <div>loading</div>;

  return (
    <>
      <title>Pokemon List</title>
      <div style={{ display: "flex", gap: "8px", padding: "8px" }}>
        <Link
          href={page > 1 ? `/${page - 1}` : ""}
          style={{
            textDecoration: "none",
            padding: "8px",
            boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          ⏪️
        </Link>
        <Link
          href={`/${page + 1}`}
          style={{
            textDecoration: "none",
            padding: "8px",
            boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          ⏩️
        </Link>
      </div>
      <hr style={{ margin: "24px 0" }} />
      <div>
        {data.map(({ key }) => (
          <div key={key}>
            <Link href={`/pokemon/${key}`}>{key}</Link>
          </div>
        ))}
      </div>
    </>
  );
};
export default Page;
