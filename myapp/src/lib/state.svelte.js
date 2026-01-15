// On est obligé de créer un état partagé avec un objet pour pouvoir réassigner cette valeur dans les différents composants
export let currentIdState = $state({value:""});