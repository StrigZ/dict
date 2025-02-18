'use client';

import { useParams } from 'next/navigation';

type Props = {};
export default function Article({}: Props) {
  const params = useParams();

  return (
    <article className="flex flex-1 flex-col gap-8 px-8">
      <h1 className="text-4xl">{params.slug}</h1>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non eos
        laborum maxime aspernatur rerum assumenda nesciunt saepe eaque totam
        explicabo earum vero alias soluta suscipit facere, ad sint vitae
        inventore dolor. Vitae eligendi quas at ipsam veniam animi dolorem,
        impedit ut consequuntur sint, explicabo temporibus commodi voluptatum,
        maiores voluptatem error sunt ad iure neque facere quasi vero quidem
        natus eaque. Labore corrupti iure odit iusto aliquid suscipit quod
        quaerat. Deleniti, odit exercitationem suscipit harum esse quisquam
        necessitatibus, voluptatem inventore eum numquam dolore omnis. Optio
        minus eos deleniti similique? Voluptas possimus ipsum eligendi
        temporibus labore architecto iusto sit eos fugit consectetur.
      </p>
    </article>
  );
}
