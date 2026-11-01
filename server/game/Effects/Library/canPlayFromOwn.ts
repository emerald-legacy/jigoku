import type BaseCard from '../../BaseCard.js';
import { CardType, EffectName, type Location, PlayType } from '../../Constants.js';
import type DrawCard from '../../DrawCard.js';
import type { PlayableLocation } from '../../PlayableLocation.js';
import type Player from '../../Player.js';
import type { DetachedValue } from '../DetachedEffect.js';
import { EffectBuilder } from '../EffectBuilder.js';

/** Lets the player play `cards` from the location of the player `getOwner` returns, as if from hand. */
export function getPlayFromLocation(
    getOwner: (player: Player) => Player | undefined,
    location: Location,
    cards: DrawCard[],
    sourceOfEffect: BaseCard,
    playType: PlayType
): DetachedValue<Player, PlayableLocation | undefined> {
    return {
        apply(player) {
            const owner = getOwner(player);
            if(!owner) {
                return undefined;
            }
            for(const card of cards) {
                if(card.type === CardType.Event && card.location === location) {
                    for(const reaction of card.getReactions()) {
                        reaction.registerEvents();
                    }
                }
                if(!card.fromOutOfPlaySource) {
                    card.fromOutOfPlaySource = [];
                }
                card.fromOutOfPlaySource.push(sourceOfEffect);
            }
            return player.addPlayableLocation(playType, owner, location, cards);
        },
        unapply(player, _context, playableLocation) {
            if(!playableLocation) {
                return;
            }
            player.removePlayableLocation(playableLocation);
            for(const card of playableLocation.cards) {
                card.removeOutOfPlaySource(sourceOfEffect);
            }
        }
    };
}

export function canPlayFromOwn(
    location: Location,
    cards: Array<DrawCard>,
    sourceOfEffect: BaseCard,
    playType = PlayType.PlayFromHand
) {
    return EffectBuilder.player.detached(EffectName.CanPlayFromOwn, getPlayFromLocation((player) => player, location, cards, sourceOfEffect, playType));
}
