import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Location, Phases, PlayType } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { canPlayFromOwn, cannotParticipateAsAttacker, cannotParticipateAsDefender } from '../../../effects.js';
import { gainHonor } from '../../../GameActions/GameActions.js';
import type BaseCard from '../../../BaseCard.js';
import DrawCard from '../../../DrawCard.js';
import { captureParentCost, capturedParent } from '../../captureParentCost.js';
import { msg } from '../../../GameChat.js';

export default class DevelopingMasterpiece extends DrawCard {
    static id = 'developing-masterpiece';

    public setupCardAbilities() {
        this.whileAttached({
            effect: [cannotParticipateAsAttacker(), cannotParticipateAsDefender()]
        });

        this.persistentEffect({
            location: Location.ConflictDiscardPile,
            effect: canPlayFromOwn(Location.ConflictDiscardPile, [this], this, PlayType.Other)
        });

        this.action('Gain honor')
            .cost(captureParentCost())
            .cost(costs.removeSelfFromGame())
            .condition((context) => !!context.source.parentCharacter)
            .gameAction(gainHonor((context) => ({
                amount: capturedParent(context)?.getGlory() ?? 0
            })))
            .effect((context) => msg`gain ${capturedParent(context)?.getGlory() ?? 0} honor`)
            .onResolve((context) => {
                randomHaiku().forEach((line) => context.game.addMessage(`>> ${line}`));
                context.game.addMessage('>>>> Matsuo Bashō <<<<');
            })
            .phase(Phases.Fate);
    }

    public canAttach(card: BaseCard): boolean {
        return (
            card.controller === this.controller &&
            card.getType() === CardType.Character &&
            (card.hasTrait('courtier') || card.hasTrait('artisan') || card.isFaction('crane')) &&
            super.canAttach(card)
        );
    }

    public canPlay(context: AbilityContext, playType: string): boolean {
        return context.game.currentPhase === Phases.Draw && super.canPlay(context, playType);
    }
}

/**
 * @see https://www.carlsensei.com/classical/index.php/author/view/1
 */

const haikus = [
    ['Ah! The ancient pond', 'As a frog takes the plunge', 'Sound of the water'],
    ['The octopus\' fleeting dream', 'in the trap', 'the summer moon'],
    ['Another year is gone;', 'and I still wear', 'straw hat and straw sandal.'],
    ['Along this road', 'Goes no one,', 'This autumn eve.'],
    ['Sick on a journey,', 'my dreams wander', 'the withered fields'],
    ['Even in Kyoto—', 'hearing the cuckoo\'s cry—', 'I long for Kyoto'],
    ['One field', 'did they plant.', 'I, under the willow.'],
    ['This pervasive silence', 'Enhanced yet by cicadas simmering', 'Into the Temple Rocks dissipating'],
    ['Dividing like clam', 'and shell, I leave for Futami—', 'Autumn is passing by'],
    ['Turbulent the sea—', 'across to Sado stretches', 'the Milky Way'],
    ['Plagued by fleas and lice,', 'I hear the horses stalling', 'Right by my pillow'],
    ['Underneath the trees', 'soups and salads are buried', 'in cherry blossoms'],
    ['The true beginnings', 'Of poetry—an Oku', 'Rice-planting song'],
    ['The man in the moon', 'Has become homeless;', 'Rain clouded night'],
    ['Though I would move the grave,', 'my teary cry', 'was lost in the autumn wind.'],
    ['I am one', 'Who eats his breakfast,', 'Gazing at morning glories.'],
    ['Deep autumn—', 'my neighbor,', 'how does he live, I wonder?'],
    ['Not this human sadness,', 'cuckoo,', 'but your solitary cry.'],
    ['Sad nodes', 'we\'re all the bamboo\'s children', 'in the end'],
    ['Sweet-smelling rice fields!', 'To our right as we push through,', 'The Ariso Sea.'],
    ['The whitebait', 'opens its eye', 'in the net of the law'],
    ['Should I take it in my hand,', 'it would disappear with my hot tears,', 'like the frost of autumn.'],
    ['The summer grasses—', 'Of the brave soldiers\' dreams', 'The aftermath.']
];
function randomHaiku(): string[] {
    return haikus[Math.floor(haikus.length * Math.random())];
}
