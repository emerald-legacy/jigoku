import DrawCard from '../../DrawCard.js';

class ArmyOfTheRisingWave extends DrawCard {
    static id = 'army-of-the-rising-wave';

    override setupCardAbilities() {
        this.reaction('Place one fate on each unclaimed ring')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .placeFateOnRing((context) =>
                ({ target: Object.values(context.game.rings).filter((ring) => ring.isUnclaimed()) }));
    }
}


export default ArmyOfTheRisingWave;
