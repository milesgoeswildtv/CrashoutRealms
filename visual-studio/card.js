import { cs, faction, escapeHtml, styleForFaction, getArt } from './state.js';

export async function cardHtml(card,opts={}){
  const st=cs(card.id),f=faction(card.faction),file=await getArt(card.id);let art='';
  if(file&&!opts.templateOnly){const url=URL.createObjectURL(file);art=`<img src="${url}" alt="Assigned art for ${escapeHtml(card.name)}" style="object-position:${st.artTransform.x}% ${st.artTransform.y}%;transform:scale(${st.artTransform.zoom})">`}
  else art=`<div class="art-placeholder"><div><b>${opts.templateOnly?'ART WINDOW':'ART NOT ASSIGNED'}</b><small>${escapeHtml(f.thesis)}</small></div></div>`;
  const classes=['realms-card'];if(opts.artOnly)classes.push('art-only');if(opts.templateOnly)classes.push('template-only');if(opts.safe)classes.push('safe-zones');
  return `<article class="${classes.join(' ')}" data-faction="${card.faction}" style="${styleForFaction(card.faction)}"><div class="card-shell"><div class="card-top"><div class="corner-value"><small>RESOURCE</small><b>+${card.resource}</b></div><div class="card-name"><h3>${escapeHtml(card.name)}</h3><p>${escapeHtml(f.name)}</p></div><div class="corner-value"><small>COST</small><b>${card.cost}</b></div></div><div class="art-zone">${art}</div><div class="type-bar">${escapeHtml(card.type)}</div><div class="mechanic-strip">${escapeHtml(card.mechanic||'')}</div><div class="rules">${escapeHtml(card.rules)}</div><div class="stats"><div class="stat"><span>STR</span><b>${card.str??'—'}</b></div><div class="card-id">${card.id}</div><div class="stat"><span>HP</span><b>${card.hp??'—'}</b></div></div></div></article>`;
}
export async function cardsHtml(cards,opts={}){return (await Promise.all(cards.map(c=>cardHtml(c,opts)))).join('')}
