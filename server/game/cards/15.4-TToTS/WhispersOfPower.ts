import DrawCard from '../../drawcard.js';
import { Players, CardTypes, Durations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class WhispersOfPower extends DrawCard {
    static id = 'whispers-of-power';

    setupCardAbilities() {
        this.action({
            title: 'Gain political power according to fateless characters',
            condition: context => context.game.isDuringConflict(),
            cost: AbilityDsl.costs.payHonor(),
            target:{
                cardType: CardTypes.Character,
                controller: Players.Any
            },
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                duration: Durations.UntilEndOfConflict,
                target: context.target,
                effect: AbilityDsl.effects.modifyPoliticalSkill(
                    this.getPoliticalPowerChange(context)
                )
            })),
            effect: 'grant {0} +{1} {2} until the end of the conflict',
            effectArgs: context => [this.getPoliticalPowerChange(context), 'political']
        });
    }

    getPoliticalPowerChange(context) {
        return context.player.opponent.filterCardsInPlay(card => card.type === CardTypes.Character && card.getFate() === 0).length * 3;
    }

    isTemptationsMaho() {
        return true;
    }
}


export default WhispersOfPower;

