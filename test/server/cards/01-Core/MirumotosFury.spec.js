describe('Mirumoto\'s Fury', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['valiant-oathkeeper', 'samurai-of-integrity', 'serene-warrior', 'doji-whisperer']
                },
                player2: {
                    fate: 5,
                    hand: ['mirumoto-s-fury']
                }
            });
            this.oathkeeper = this.player1.findCardByName('valiant-oathkeeper');
            this.samurai = this.player1.findCardByName('samurai-of-integrity');
            this.sereneWarrior = this.player1.findCardByName('serene-warrior');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.fury = this.player2.findCardByName('mirumoto-s-fury');
            this.province1 = this.player2.findCardByName('shameful-display', 'province 1');
            this.province2 = this.player2.findCardByName('shameful-display', 'province 2');
            this.province3 = this.player2.findCardByName('shameful-display', 'province 3');
            this.province4 = this.player2.findCardByName('shameful-display', 'province 4');
            this.strongholdProvince = this.player2.findCardByName('shameful-display', 'stronghold province');
        });

        it('bows an attacking character with glory X or lower, X being your unrevealed provinces', function() {
            this.province2.facedown = false;
            this.province3.facedown = false;
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.province1,
                attackers: [this.oathkeeper, this.samurai, this.sereneWarrior],
                defenders: []
            });
            expect(this.province4.isFacedown()).toBe(true);
            expect(this.strongholdProvince.isFacedown()).toBe(true);
            this.player2.clickCard(this.fury);
            expect(this.player2).toHavePrompt('Mirumoto\'s Fury');
            expect(this.player2).toBeAbleToSelect(this.oathkeeper);
            expect(this.player2).toBeAbleToSelect(this.samurai);
            expect(this.player2).not.toBeAbleToSelect(this.sereneWarrior);
            expect(this.player2).not.toBeAbleToSelect(this.whisperer);
            this.player2.clickCard(this.samurai);
            expect(this.samurai.bowed).toBe(true);
            expect(this.fury.location).toBe('conflict discard pile');
        });

        it('counts the stronghold province as an unrevealed province (ruling #154)', function() {
            this.province2.facedown = false;
            this.province3.facedown = false;
            this.province4.facedown = false;
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.province1,
                attackers: [this.oathkeeper, this.samurai],
                defenders: []
            });
            expect(this.strongholdProvince.isFacedown()).toBe(true);
            this.player2.clickCard(this.fury);
            expect(this.player2).toHavePrompt('Mirumoto\'s Fury');
            expect(this.player2).toBeAbleToSelect(this.oathkeeper);
            expect(this.player2).not.toBeAbleToSelect(this.samurai);
            this.player2.clickCard(this.oathkeeper);
            expect(this.oathkeeper.bowed).toBe(true);
        });

        it('cannot be played outside a conflict', function() {
            this.player1.pass();
            expect(this.player2).toHavePrompt('Action Window');
            this.player2.clickCard(this.fury);
            expect(this.player2).toHavePrompt('Action Window');
            expect(this.fury.location).toBe('hand');
            expect(this.player2.fate).toBe(5);
        });
    });
});
