Why Change the Room?
Each editor needs to be in its own "room" to maintain separate document states for different languages. If all editors were in the same room, they would share the same Yjs document, leading to confusion and mixing of content. By using different room names, we ensure each editor has its own collaborative space.

For next js >= 13 you can use usePathname hook to get the curren path and with the URLSearchParams class you can set query params and then use toString method to flat them.

"use client";
import { usePathname, useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();
    const pathname = usePathname();

    const addQueryParam = () => {
        const params = new URLSearchParams();
        params.set("param", "value");
        router.push(`${pathname}?${params.toString()}`);
    };

    return <button onClick={addQueryParam}>Add query param</button>;
};

export default Page;


agar main page se input le rhe ho and you want that input in some other component....use router and searchParams...etc. 
And if in this case we had input as a string so we cant call it as a function so we created a map...mapping the input and main languages imported 