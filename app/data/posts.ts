export interface Post {
  slug: string
  title: string
  description: string
  date: string
  category: string
  content: string
}

export const posts: Post[] = [
  {
    slug: 'legalite-cbd-france',
    title: 'Le CBD légal en France : ce que dit la loi en 2026',
    description: "Tour d'horizon complet de la réglementation française sur le CBD en 2026 : ce qui est autorisé, les seuils légaux, et ce que cela change pour les consommateurs.",
    date: '2026-05-15',
    category: 'Réglementation',
    content: `
      <h2>Le cadre légal du CBD en France</h2>
      <p>Depuis le décret n°2021-1247 du 29 septembre 2021, la commercialisation des fleurs et feuilles de cannabis à usage du chanvre est encadrée par deux conditions principales :</p>
      <ul>
        <li>La variété de chanvre doit être inscrite au catalogue officiel de l'Union européenne</li>
        <li>Le taux de THC dans le produit fini doit être <strong>strictement inférieur à 0,3 %</strong></li>
      </ul>
      <p>Ce seuil de 0,3 % est la ligne de démarcation entre le CBD légal et le cannabis classifié stupéfiant.</p>
      <h2>Ce qui est autorisé à la vente</h2>
      <p>En France, vous pouvez légalement acheter et consommer :</p>
      <ul>
        <li><strong>Les fleurs et feuilles de CBD</strong> issues de variétés conformes, avec THC &lt; 0,3 %</li>
        <li><strong>Les huiles de CBD</strong> (huiles de chanvre enrichies en cannabidiol)</li>
        <li><strong>Les résines et extraits</strong> respectant le seuil légal</li>
        <li><strong>Les produits cosmétiques</strong> à base de CBD</li>
      </ul>
      <h2>Ce qui reste interdit</h2>
      <p>Le THC, quelle que soit sa concentration au-dessus du seuil légal, reste classifié comme stupéfiant. La vente de cannabis traditionnel, même à faible teneur, est prohibée.</p>
      <h2>L'importance des certificats d'analyse (COA)</h2>
      <p>Chaque lot de CBD sérieux est accompagné d'un <strong>certificat d'analyse</strong> délivré par un laboratoire accrédité. Ce document atteste du taux exact de THC et de CBD du produit. Chez OMEGACBD, nous exigeons ces analyses pour chaque référence de notre catalogue.</p>
      <h2>En résumé</h2>
      <p>Le CBD est légal en France dès lors que le produit respecte le seuil de 0,3 % de THC et provient d'une variété de chanvre autorisée. C'est dans ce cadre strict qu'OMEGACBD opère — pour vous offrir des produits de qualité, en toute conformité.</p>
    `
  },
  {
    slug: 'cbd-vs-thc-differences',
    title: 'CBD vs THC : comprendre les différences',
    description: "CBD et THC sont deux molécules du cannabis, mais elles n'ont pas les mêmes effets ni le même statut légal. On vous explique tout simplement.",
    date: '2026-05-10',
    category: 'Éducation',
    content: `
      <h2>Deux molécules, une même plante</h2>
      <p>Le cannabis contient plus de 100 cannabinoïdes différents. Parmi eux, deux dominent :</p>
      <ul>
        <li><strong>Le THC</strong> (tétrahydrocannabinol) — responsable des effets psychoactifs</li>
        <li><strong>Le CBD</strong> (cannabidiol) — non psychoactif, au cœur du marché légal</li>
      </ul>
      <p>Ces deux molécules partagent la même formule chimique (C₂₁H₃₀O₂) mais une structure spatiale différente, ce qui explique leurs effets radicalement distincts sur l'organisme.</p>
      <h2>Le THC : la molécule psychoactive</h2>
      <p>Le THC se lie directement aux récepteurs CB1 du cerveau, provoquant l'euphorie associée au cannabis. C'est précisément cette action qui le classe comme stupéfiant en France au-delà de 0,3 % dans le produit fini.</p>
      <h2>Le CBD : non psychoactif</h2>
      <p>Le CBD n'entraîne aucun effet "planant". Il interagit avec le système endocannabinoïde de manière indirecte, sans provoquer d'altération de la conscience. C'est ce qui lui vaut son statut légal en France et dans l'Union européenne.</p>
      <h2>Les effets comparés</h2>
      <table>
        <thead><tr><th></th><th>CBD</th><th>THC</th></tr></thead>
        <tbody>
          <tr><td>Psychoactif</td><td>Non</td><td>Oui</td></tr>
          <tr><td>Légal en France</td><td>Oui (THC &lt; 0,3 %)</td><td>Non</td></tr>
          <tr><td>Effet relaxant</td><td>Oui</td><td>Oui</td></tr>
          <tr><td>Altération cognitive</td><td>Non</td><td>Oui</td></tr>
        </tbody>
      </table>
      <h2>Ce que cela signifie pour nos produits</h2>
      <p>Chez OMEGACBD, tous nos produits sont issus de variétés de chanvre certifiées, avec un taux de THC <strong>inférieur à 0,3 %</strong>. Vous bénéficiez des propriétés du CBD sans aucun effet psychoactif, dans un cadre légal parfaitement défini.</p>
    `
  },
  {
    slug: 'bienfaits-cbd-science',
    title: 'Les bienfaits du CBD : ce que dit la science',
    description: "Relaxation, sommeil, récupération — le CBD est souvent associé à de nombreux bienfaits. Voici ce que la recherche scientifique dit réellement.",
    date: '2026-05-05',
    category: 'Bien-être',
    content: `
      <h2>Le système endocannabinoïde</h2>
      <p>Pour comprendre comment le CBD agit, il faut connaître le <strong>système endocannabinoïde</strong> (SEC). Ce système biologique, présent chez tous les mammifères, régule de nombreuses fonctions corporelles : le sommeil, l'humeur, la douleur, l'appétit et la réponse immunitaire.</p>
      <p>Le CBD interagit avec ce système de manière indirecte, notamment en inhibant la dégradation des endocannabinoïdes naturellement produits par l'organisme.</p>
      <h2>Ce que montrent les études</h2>
      <h3>Relaxation et gestion du stress</h3>
      <p>Des études préliminaires suggèrent que le CBD pourrait moduler la réponse au stress en agissant sur les récepteurs sérotoninergiques. Des résultats prometteurs, mais qui nécessitent encore des recherches à plus grande échelle.</p>
      <h3>Qualité du sommeil</h3>
      <p>Plusieurs utilisateurs rapportent une amélioration de la qualité de leur sommeil. Des études observationnelles pointent dans cette direction, sans que le mécanisme exact soit encore pleinement établi.</p>
      <h3>Récupération physique</h3>
      <p>Dans le domaine sportif, le CBD est utilisé par certains athlètes pour accompagner la récupération musculaire. L'Agence mondiale antidopage (AMA) a retiré le CBD de sa liste des substances interdites en 2018.</p>
      <h2>Ce que le CBD n'est pas</h2>
      <p>Le CBD n'est <strong>pas un médicament</strong>. Nos produits ne sont pas destinés à diagnostiquer, traiter, guérir ou prévenir une maladie. Toute allégation thérapeutique serait contraire à la réglementation européenne.</p>
      <h2>Notre engagement</h2>
      <p>Chez OMEGACBD, nous ne vendons pas de promesses. Nous sélectionnons des fleurs de CBD d'exception, issues de cultures indoor maîtrisées, pour vous offrir une expérience qualitative sans équivalent — dans le respect total de la législation française.</p>
    `
  }
]

export const getPostBySlug = (slug: string) => posts.find(p => p.slug === slug)
