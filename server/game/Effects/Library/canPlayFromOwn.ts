import type BaseCard from '../../basecard.js';
import { CardTypes, EffectNames, Locations, PlayTypes } from '../../Constants.js';
import type DrawCard from '../../drawcard.js';
import type { PlayableLocation } from '../../PlayableLocation.js';
import type Player from '../../player.js';
import { EffectBuilder } from '../EffectBuilder.js';

export function canPlayFromOwn(
    location: Locations,
    cards: Array<DrawCard>,
    sourceOfEffect: BaseCard,
    playType = PlayTypes.PlayFromHand
) {
    return EffectBuilder.player.detached(EffectNames.CanPlayFromOwn, {
        apply(target) {
            const player = target as Player;
            for(const card of cards) {
                if(card.type === CardTypes.Event && card.location === location) {
                    for(const reaction of card.reactions) {
                        reaction.registerEvents();
                    }
                }

                if(!card.fromOutOfPlaySource) {
                    card.fromOutOfPlaySource = [];
                }
                card.fromOutOfPlaySource.push(sourceOfEffect);
            }

            return player.addPlayableLocation(playType, player, location, cards);
        },
        unapply(target, _context, state) {
            const player = target as Player;
            const location = state as PlayableLocation;
            player.removePlayableLocation(location);
            for(const card of location.cards) {
                if(Array.isArray(card.fromOutOfPlaySource)) {
                    // @TODO - The following commented line does nothing
                    // It might need a new implementation for cleaning up this property
                    // If we update the fromOutOfPlaySource property, it impacts
                    // cards like Master Tactician and Bayushi Kachiko 2
                    // A possible solution is to mark on the OnCardPlayed event
                    // what is allowing the card to be played
                    // card.fromOutOfPlaySource.filter((a) => a !== context.source);
                    if(card.fromOutOfPlaySource.length === 0) {
                        delete card.fromOutOfPlaySource;
                    }
                }
            }
        }
    });
}
