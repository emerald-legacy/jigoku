import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { EventName, Location, TargetMode } from '../../../Constants.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
class Stowaway extends DrawCard {
    static id = 'stowaway';

    setupCardAbilities() {
        this.reaction('Place cards underneath self')
            .when({
                onConflictDeclared: (event: EventPayload<EventName.OnConflictDeclared>, context) => !!event.attackers?.includes(context.source),
                onDefendersDeclared: (event: EventPayload<EventName.OnDefendersDeclared>, context) => !!event.defenders?.includes(context.source),
                onCharacterEntersPlay: (event: EventPayload<EventName.OnCharacterEntersPlay>, context) => event.card === context.source && context.game.isDuringConflict() && context.source.isParticipating()
            })
            .targetCards('target', {
                location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
                mode: TargetMode.UpTo,
                numCards: 2,
                activePromptTitle: 'Choose up to 2 cards in a discard pile',
                sameDiscardPile: true
            }, AbilityDsl.actions.placeCardUnderneath({ destination: this }))
            .effect('place {0} beneath {1}', context => [context.source]);

        this.persistentEffect({
            effect: AbilityDsl.effects.modifyMilitarySkill((card: DrawCard) => this.getSkillBonus(card))
        });
    }

    getSkillBonus(card: DrawCard) {
        const cardsUnder = card.game.allCards.filter((card) => card.controller === this.controller && card.location === this.uuid).length;
        return Math.floor(cardsUnder / 2);
    }
}


export default Stowaway;
