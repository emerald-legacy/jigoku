describe('Composite Yumi', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['wandering-ronin', 'eager-scout', 'shinjo-sora'],
                    dynastyDeck: ['favorable-ground', 'hida-kisada', 'imperial-storehouse'],
                    hand: ['composite-yumi', 'steward-of-law'],
                    provinces: ['manicured-garden']
                },
                player2: {
                    inPlay: ['shinjo-outrider'],
                    hand: ['stoic-gunso']
                }
            });
            this.fg = this.player1.placeCardInProvince('favorable-ground', 'province 1');
            this.wanderingRonin = this.player1.findCardByName('wandering-ronin');
            this.scout = this.player1.findCardByName('eager-scout');
            this.sora = this.player1.findCardByName('shinjo-sora');
            this.stewardOfLaw = this.player1.findCardByName('steward-of-law');
            this.compositeYumi = this.player1.findCardByName('composite-yumi');

            this.shinjoOutrider = this.player2.findCardByName('shinjo-outrider');
            this.stoicGunso = this.player2.findCardByName('stoic-gunso');

            this.garden = this.player1.findCardByName('manicured-garden');
            this.kisada = this.player1.findCardByName('hida-kisada');
            this.storehouse = this.player1.findCardByName('imperial-storehouse');
            this.player1.moveCard(this.storehouse, this.garden.location);
            this.player1.moveCard(this.kisada, this.garden.location);
            this.kisada.facedown = true;
            this.storehouse.facedown = true;

            this.player1.playAttachment(this.compositeYumi, this.wanderingRonin);

            this.noMoreActions();
        });

        it('should trigger when a friendly character moves to the conflict', function () {
            this.initiateConflict({
                attackers: [this.wanderingRonin],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.fg);
            this.player1.clickCard(this.scout);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.compositeYumi);
        });

        it('should not trigger when a friendly character moves home', function () {
            this.initiateConflict({
                attackers: [this.wanderingRonin, this.scout],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.fg);
            this.player1.clickCard(this.scout);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });

        it('should trigger when an opposing character moves to the conflict', function () {
            this.initiateConflict({
                attackers: [this.wanderingRonin],
                defenders: []
            });
            this.player2.clickCard(this.shinjoOutrider);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.compositeYumi);
        });

        it('should trigger when it moves itself to the conflict', function () {
            this.initiateConflict({
                attackers: [this.scout],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.fg);
            this.player1.clickCard(this.wanderingRonin);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.compositeYumi);
        });

        it('should trigger when a friendly character is played into the conflict', function () {
            this.initiateConflict({
                attackers: [this.wanderingRonin],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.stewardOfLaw);
            this.player1.clickPrompt('0');
            this.player1.clickPrompt('Conflict');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.compositeYumi);
        });

        it('should trigger when an opposing character is played into the conflict', function () {
            this.initiateConflict({
                attackers: [this.wanderingRonin],
                defenders: []
            });
            this.player2.clickCard(this.stoicGunso);
            this.player2.clickPrompt('0');
            this.player2.clickPrompt('Conflict');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.compositeYumi);
        });

        it('should trigger when a character is played at home during a conflict if holder is participating', function () {
            this.initiateConflict({
                attackers: [this.wanderingRonin],
                defenders: []
            });
            this.player2.clickCard(this.stoicGunso);
            this.player2.clickPrompt('0');
            this.player2.clickPrompt('Home');
            expect(this.player1).toHavePrompt('Triggered Abilities');
        });

        it('should not trigger if holder is not participating in the conflict', function () {
            this.initiateConflict({
                attackers: [this.scout],
                defenders: []
            });
            this.player2.clickCard(this.shinjoOutrider);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });

        it('should give him +1 military', function () {
            this.initiateConflict({
                attackers: [this.wanderingRonin],
                defenders: []
            });
            this.player2.clickCard(this.stoicGunso);
            this.player2.clickPrompt('0');
            this.player2.clickPrompt('Conflict');
            this.player1.clickCard(this.compositeYumi);
            expect(this.wanderingRonin.getMilitarySkill()).toBe(2 + 1 + 1);
            expect(this.getChatLogs(5)).toContain('player1 uses Composite Yumi to give +1military to Wandering Ronin');
        });

        it('should trigger multiple times in a conflict', function () {
            this.initiateConflict({
                attackers: [this.wanderingRonin],
                defenders: []
            });
            this.player2.clickCard(this.stoicGunso);
            this.player2.clickPrompt('0');
            this.player2.clickPrompt('Conflict');
            this.player1.clickCard(this.compositeYumi);
            expect(this.wanderingRonin.getMilitarySkill()).toBe(2 + 1 + 1);
            this.player1.clickCard(this.fg);
            this.player1.clickCard(this.scout);
            this.player1.clickCard(this.compositeYumi);
            expect(this.wanderingRonin.getMilitarySkill()).toBe(2 + 1 + 2);
            this.player2.clickCard(this.shinjoOutrider);
            this.player1.clickCard(this.compositeYumi);
            expect(this.wanderingRonin.getMilitarySkill()).toBe(2 + 1 + 3);
            this.player1.clickCard(this.stewardOfLaw);
            this.player1.clickPrompt('0');
            this.player1.clickPrompt('Conflict');
            this.player1.clickCard(this.compositeYumi);
            expect(this.wanderingRonin.getMilitarySkill()).toBe(2 + 1 + 4);
        });

        it('comboes with Shinjo Sora', function () {
            // Sora has Covert, so the defenders are assigned after that prompt is answered
            this.initiateConflict({ attackers: [this.wanderingRonin, this.sora] });
            this.player1.clickPrompt('No Target');
            this.player2.assignDefenders([]);
            this.player2.pass();

            // Leave exactly two facedown cards for Sora to turn into hounds
            this.game
                .getProvinceArray()
                .flatMap((location) => this.player1.player.getDynastyCardsInProvince(location))
                .filter((card) => card.isFacedown() && card !== this.kisada && card !== this.storehouse)
                .forEach((card) => this.player1.moveCard(card, 'dynasty deck'));

            this.player1.clickCard(this.sora);

            // The facedown cards are removed from the game as the hounds are created, so
            // the window offers the hounds themselves - the cards a player can still see
            const hounds = this.game.currentConflict.attackers.filter(
                (card) => card.name === 'Unleashed Hound'
            );
            expect(hounds.length).toBe(2);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.compositeYumi);
            expect(this.player1).toBeAbleToSelect(hounds[0]);
            expect(this.player1).not.toBeAbleToSelect(this.kisada);
            this.player1.clickCard(hounds[0]);
            expect(this.getChatLogs(3)).toContain('player1 uses Composite Yumi to give +1military to Wandering Ronin');

            expect(this.player1).toBeAbleToSelect(this.compositeYumi);
            this.player1.clickCard(this.compositeYumi);

            expect(this.wanderingRonin.getMilitarySkill()).toBe(3 + 2);
            expect(this.player1).not.toBeAbleToSelect(this.compositeYumi);
        });
    });
});
