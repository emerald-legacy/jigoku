import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, EventNames, Locations } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class DiscerningYoriki extends DrawCard {
    static id = 'discerning-yoriki';

    setupCardAbilities() {
        this.reaction({
            title: 'Honor a character',
            collectiveTrigger: true,
            when: {
                onCardRevealed: (event: EventPayload<EventNames.OnCardRevealed>, context) => {
                    const cards = Array.isArray(event.card) ? event.card : [event.card];
                    return cards.some((a: any) => a.location === Locations.Hand && a.controller === context.player.opponent);
                },
                onLookAtCards: (event: EventPayload<EventNames.OnLookAtCards>, context) => {
                    const raw = event.stateBeforeResolution;
                    const cards = Array.isArray(raw) ? raw : [raw];
                    return cards.some((a: any) => a?.location === Locations.Hand && a?.card?.controller === context.player.opponent);
                }
            },
            target: {
                activePromptTitle: 'Choose a character to honor',
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}


export default DiscerningYoriki;
