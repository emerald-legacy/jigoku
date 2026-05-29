import DrawCard from '../../../drawcard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { EventNames, Locations, TargetModes } from '../../../Constants.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
class Stowaway extends DrawCard {
    static id = 'stowaway';

    setupCardAbilities() {
        this.reaction({
            title: 'Place cards underneath self',
            when: {
                onConflictDeclared: (event: EventPayload<EventNames.OnConflictDeclared>, context: any) => !!event.attackers?.includes(context.source),
                onDefendersDeclared: (event: EventPayload<EventNames.OnDefendersDeclared>, context: any) => !!event.defenders?.includes(context.source),
                onCharacterEntersPlay: (event: EventPayload<EventNames.OnCharacterEntersPlay>, context: any) => event.card === context.source && context.game.isDuringConflict() && context.source.isParticipating()
            },
            effect: 'place {0} beneath {1}',
            effectArgs: context => [context.source],
            target: {
                location: [Locations.DynastyDiscardPile, Locations.ConflictDiscardPile],
                mode: TargetModes.UpTo,
                numCards: 2,
                activePromptTitle: 'Choose up to 2 cards in a discard pile',
                sameDiscardPile: true,
                gameAction: AbilityDsl.actions.placeCardUnderneath({ destination: this })
            }
        });

        this.persistentEffect({
            effect: AbilityDsl.effects.modifyMilitarySkill((card: any) => this.getSkillBonus(card))
        });
    }

    getSkillBonus(card: any) {
        const cardsUnder = card.game.allCards.filter((card: any) => card.controller === this.controller && card.location === this.uuid).length;
        return Math.floor(cardsUnder / 2);
    }
}


export default Stowaway;
