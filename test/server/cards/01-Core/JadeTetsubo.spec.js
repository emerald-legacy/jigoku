describe('Jade Tetsubō', function() {
    integration(function() {
        describe('Jade Tetsubō\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 10,
                        inPlay: [
                            { card: 'samurai-of-integrity', attachments: ['jade-tetsubo'] },
                            { card: 'valiant-oathkeeper', fate: 1 },
                            'serene-warrior'
                        ]
                    },
                    player2: {
                        fate: 10,
                        inPlay: [
                            { card: 'doji-whisperer', fate: 2 },
                            { card: 'wild-ogre', fate: 1 },
                            { card: 'attendant-to-the-emperor', fate: 1 }
                        ]
                    }
                });
                this.samurai = this.player1.findCardByName('samurai-of-integrity');
                this.tetsubo = this.player1.findCardByName('jade-tetsubo');
                this.oathkeeper = this.player1.findCardByName('valiant-oathkeeper');
                this.sereneWarrior = this.player1.findCardByName('serene-warrior');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.ogre = this.player2.findCardByName('wild-ogre');
                this.attendant = this.player2.findCardByName('attendant-to-the-emperor');
                this.noMoreActions();
            });

            it('bows itself to return all fate from a participating character with lower military skill to its owner', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.samurai, this.oathkeeper],
                    defenders: [this.whisperer, this.ogre]
                });
                expect(this.samurai.militarySkill).toBe(6);
                this.player2.pass();
                this.player1.clickCard(this.tetsubo);
                expect(this.player1).toHavePrompt('Jade Tetsubō');
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                expect(this.player1).toBeAbleToSelect(this.oathkeeper);
                expect(this.player1).not.toBeAbleToSelect(this.ogre);
                expect(this.player1).not.toBeAbleToSelect(this.attendant);
                expect(this.player1).not.toBeAbleToSelect(this.samurai);
                this.player1.clickCard(this.whisperer);
                expect(this.whisperer.fate).toBe(0);
                expect(this.player2.fate).toBe(12);
                expect(this.player1.fate).toBe(10);
                expect(this.tetsubo.bowed).toBe(true);
            });

            it('returns the fate to the owner of the chosen character (ruling #142)', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.samurai, this.oathkeeper],
                    defenders: [this.whisperer, this.ogre]
                });
                this.player2.pass();
                this.player1.clickCard(this.tetsubo);
                this.player1.clickCard(this.oathkeeper);
                expect(this.oathkeeper.fate).toBe(0);
                expect(this.player1.fate).toBe(11);
                expect(this.player2.fate).toBe(10);
            });

            it('cannot be used while the attached character is not participating', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.oathkeeper, this.sereneWarrior],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
                this.player1.clickCard(this.tetsubo);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.tetsubo.bowed).toBe(false);
                expect(this.whisperer.fate).toBe(2);
                expect(this.player2.fate).toBe(10);
            });
        });

        describe('Jade Tetsubō\'s attachment restriction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 10,
                        inPlay: ['valiant-oathkeeper'],
                        hand: ['jade-tetsubo']
                    },
                    player2: {
                        inPlay: ['doji-whisperer']
                    }
                });
                this.tetsubo = this.player1.findCardByName('jade-tetsubo');
                this.oathkeeper = this.player1.findCardByName('valiant-oathkeeper');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
            });

            it('can only be attached to a character you control', function() {
                this.player1.clickCard(this.tetsubo);
                expect(this.player1).toBeAbleToSelect(this.oathkeeper);
                expect(this.player1).not.toBeAbleToSelect(this.whisperer);
                this.player1.clickCard(this.oathkeeper);
                expect(this.oathkeeper.attachments).toContain(this.tetsubo);
            });
        });
    });
});
