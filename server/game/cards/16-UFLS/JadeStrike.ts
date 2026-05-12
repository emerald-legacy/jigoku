import DrawCard from '../../drawcard';
import { CardTypes } from '../../Constants';
import AbilityDsl from '../../abilitydsl';

class JadeStrike extends DrawCard {
    static id = 'jade-strike';

    setupCardAbilities() {
        this.action({
            title: 'Set a characters base skills to 0/0',

            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.hasStatusTokens && card.isParticipating(),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect({
                        effect: [
                            AbilityDsl.effects.setBaseMilitarySkill(0),
                            AbilityDsl.effects.setBasePoliticalSkill(0)
                        ]
                    }),
                    AbilityDsl.actions.removeFate(context => ({
                        target: context.target.isTainted ? context.target : []
                    }))
                ])
            },
            effect: '{3}set the base skills of {0} to 0{1}/0{2}',
            effectArgs: context => ['military', 'political', context.target.isTainted ? 'remove a fate from and ' : '']
        });
    }

    canPlay(context, playType) {
        if(!context.player.cardsInPlay.some(card => card.getType() === CardTypes.Character && card.hasTrait('shugenja'))) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}


export default JadeStrike;
