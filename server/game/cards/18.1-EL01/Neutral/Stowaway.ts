import DrawCard from '../../../drawcard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { Locations, Players, TargetModes } from '../../../Constants.js';

class Stowaway extends DrawCard {
    static id = 'stowaway';

    setupCardAbilities() {
        this.reaction({
            title: 'Place cards underneath self',
            when: {
                onConflictDeclared: (event, context) => event.attackers.includes(context.source),
                onDefendersDeclared: (event, context) => event.defenders.includes(context.source),
                onCharacterEntersPlay: (event, context) => event.card === context.source && context.game.isDuringConflict() && context.source.isParticipating()
            },
            effect: 'place {0} beneath {1}',
            effectArgs: context => [context.source],
            target: {
                location: [Locations.DynastyDiscardPile, Locations.ConflictDiscardPile],
                player: Players.Any,
                mode: TargetModes.UpTo,
                numCards: 2,
                activePromptTitle: 'Choose up to 2 cards in a discard pile',
                sameDiscardPile: true,
                gameAction: AbilityDsl.actions.placeCardUnderneath({ destination: this })
            }
        });

        this.persistentEffect({
            effect: AbilityDsl.effects.modifyMilitarySkill(card => this.getSkillBonus(card))
        });
    }

    getSkillBonus(card) {
        const cardsUnder = card.game.allCards.filter(card => card.controller === this.controller && card.location === this.uuid).length;
        return Math.floor(cardsUnder / 2);
    }
}


export default Stowaway;
