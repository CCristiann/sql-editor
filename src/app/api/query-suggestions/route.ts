import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userQueryDescription } = await req.json();

    const deepSeekUrl = "https://api.deepseek.com/v1/chat/completions";

    const payload = {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `
            Sei un esperto SQL. L'utente vuole interrogare un database e ha scritto questa descrizione:
            "${userQueryDescription}"

            Basandoti sui seguenti schemi di PRISMA ORM suggerisci una query SQL che estrae dati senza modificare il database. Rispondi SOLO con la query SQL (SOLO IL TESTO SENZA FORMATTAZIONE DI NESSUN TIPO ) e niente altro.

            Ecco gli che schemi di PRISMA ORM:
            enum Continent {
    Asia
    Europe
    NorthAmerica
    Africa
    Oceania
    Antarctica
    SouthAmerica
}

model Country {
  code           String   @id
  name           String 
  continent      Continent
  region         String  
  surfaceArea    Decimal  
  indepYear      Int?     
  population     Int 
  lifeExpectancy Decimal?
  gnp            Decimal?
  gnpOld         Decimal? 
  localName      String   
  governmentForm String   
  headOfState    String?  
  capital        Int? 
  code2          String  

  cities         City[]
  languages      CountryLanguage[]
}

model City {
  id          Int     @id @default(autoincrement())
  name        String 
  countryCode String 
  district    String  
  population  Int    

  country     Country @relation(fields: [countryCode], references: [code])
}

model CountryLanguage {
  countryCode String  
  language    String  
  isOfficial  Boolean 
  percentage  Decimal 

  country     Country @relation(fields: [countryCode], references: [code])

  @@id([countryCode, language])
}


Ricorda che sto usando il metodo di prisma $queryRawUnsafe che impone di usare le doppie virgolette per selezionare i dati. Ecco un esempio di come fare: SELECT
c. "code",
c. "continent",
c. "name" AS "country_name", ci. "id",
ci. "name" AS "city_name"
FROM
"Country" c
JOIN
"City" ci
ON
c."code" = ci."countryCode";
          `,
        },
      ],
      max_tokens: 200,
    };

    const response = await fetch(deepSeekUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    const data = await response.json();
    const suggestedQuery = data.choices[0]?.message?.content;

    return NextResponse.json({ query: suggestedQuery });
  } catch (error) {
    console.error("Error fetching query suggestion:", error);
    return NextResponse.json(
      { error: "Error generating query" },
      { status: 500 }
    );
  }
}
